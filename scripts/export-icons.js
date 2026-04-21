const https = require('https');
const fs = require('fs');
const path = require('path');

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY;
const FIGMA_ICONS_NODE_ID = process.env.FIGMA_ICONS_NODE_ID;
const OUTPUT_DIR = path.join(__dirname, '..', 'icons', 'svg');
const MANIFEST_PATH = path.join(__dirname, '..', 'icons', 'manifest.json');

for (const [name, value] of [
  ['FIGMA_TOKEN', FIGMA_TOKEN],
  ['FIGMA_FILE_KEY', FIGMA_FILE_KEY],
  ['FIGMA_ICONS_NODE_ID', FIGMA_ICONS_NODE_ID],
]) {
  if (!value) {
    console.error(`Missing required environment variable: ${name}`);
    process.exit(1);
  }
}

function fetch(url, headers) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          reject(new Error(`HTTP ${res.statusCode} from Figma API: ${data}`));
          return;
        }
        resolve(JSON.parse(data));
      });
      res.on('error', reject);
    });
  });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        download(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
      file.on('error', reject);
    }).on('error', reject);
  });
}

// Convert "Navigation/arrow-chevron-up" → category: "Navigation", name: "arrow-chevron-up"
function parseName(componentName) {
  const parts = componentName.split('/');
  if (parts.length === 2) {
    return { category: parts[0].trim(), name: parts[1].trim() };
  }
  return { category: 'Other', name: parts[parts.length - 1].trim() };
}

async function withConcurrency(tasks, limit = 10) {
  let i = 0;
  async function worker() {
    while (i < tasks.length) {
      await tasks[i++]();
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, tasks.length) }, worker));
}

async function getNodeIdsInFrame(frameNodeId) {
  const normalizedId = frameNodeId.replace('-', ':');
  console.log(`Fetching children of icons frame (node ${normalizedId})...`);

  const data = await fetch(
    `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/nodes?ids=${normalizedId}`,
    { 'X-Figma-Token': FIGMA_TOKEN }
  );

  const node = data.nodes?.[normalizedId];
  if (!node) {
    throw new Error(`Could not find node ${normalizedId} in file`);
  }

  const ids = new Set();
  function collect(n) {
    ids.add(n.document.id);
    for (const child of n.document.children || []) {
      collectNode(child);
    }
  }
  function collectNode(n) {
    ids.add(n.id);
    for (const child of n.children || []) {
      collectNode(child);
    }
  }
  collect(node);
  return ids;
}

async function main() {
  // Step 1 — get all node IDs within the icons frame
  const frameNodeIds = await getNodeIdsInFrame(FIGMA_ICONS_NODE_ID);
  console.log(`Found ${frameNodeIds.size} nodes inside icons frame`);

  // Step 2 — fetch all components in the file
  console.log('Fetching components from Figma...');
  const file = await fetch(
    `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/components`,
    { 'X-Figma-Token': FIGMA_TOKEN }
  );

  const allComponents = file.meta?.components || [];
  console.log(`Total components in file: ${allComponents.length}`);

  // Step 3 — filter to icons frame and parse names once
  const components = allComponents
    .filter((c) => frameNodeIds.has(c.node_id))
    .map((c) => ({ ...c, parsed: parseName(c.name) }));
  console.log(`Components inside icons frame: ${components.length}`);

  if (components.length === 0) {
    console.log('No components found inside the icons frame. Check FIGMA_ICONS_NODE_ID.');
    process.exit(1);
  }

  const categoryNames = [...new Set(components.map((c) => c.parsed.category))];
  console.log('Categories:', categoryNames.join(', '));

  // Step 4 — load existing manifest to detect unchanged icons
  const oldManifestMap = new Map();
  if (fs.existsSync(MANIFEST_PATH)) {
    const oldManifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
    for (const icon of oldManifest.icons) {
      oldManifestMap.set(icon.node_id, icon);
    }
  }

  // Split into icons that need downloading vs unchanged
  const toDownload = [];
  const newIcons = [];

  for (const component of components) {
    const { category, name: iconName } = component.parsed;
    const existing = oldManifestMap.get(component.node_id);
    if (existing && existing.updated_at === component.updated_at) {
      newIcons.push({ category, name: iconName, node_id: component.node_id, updated_at: component.updated_at });
    } else {
      toDownload.push(component);
    }
  }

  const skipped = newIcons.length;
  console.log(`Unchanged: ${skipped}, to download: ${toDownload.length}`);

  // Step 5 — request SVG export URLs only for icons that need downloading
  const urls = {};
  if (toDownload.length > 0) {
    console.log('Requesting SVG export URLs from Figma...');
    const CHUNK_SIZE = 100;
    for (let i = 0; i < toDownload.length; i += CHUNK_SIZE) {
      const chunk = toDownload.slice(i, i + CHUNK_SIZE);
      const nodeIds = chunk.map((c) => c.node_id).join(',');
      const images = await fetch(
        `https://api.figma.com/v1/images/${FIGMA_FILE_KEY}?ids=${nodeIds}&format=svg`,
        { 'X-Figma-Token': FIGMA_TOKEN }
      );
      Object.assign(urls, images.images || {});
    }
  }

  // Step 6 — download new/updated SVGs in parallel
  let downloaded = 0;

  const tasks = toDownload.map((component) => async () => {
    const { category, name: iconName } = component.parsed;
    const url = urls[component.node_id];
    if (!url) {
      console.warn(`  No URL for ${component.name}`);
      return;
    }

    fs.mkdirSync(path.join(OUTPUT_DIR, category), { recursive: true });

    const dest = path.join(OUTPUT_DIR, category, `${iconName}.svg`);
    await download(url, dest);
    downloaded++;
    newIcons.push({ category, name: iconName, node_id: component.node_id, updated_at: component.updated_at });
    console.log(`  ✓ ${category}/${iconName}.svg`);
  });

  await withConcurrency(tasks, 10);

  console.log(`\nDone! Downloaded ${downloaded}, skipped ${skipped} unchanged.`);

  // Delete any SVG files on disk not present in the current Figma icon set
  const newKeys = new Set(newIcons.map((i) => `${i.category}/${i.name}`));

  if (fs.existsSync(OUTPUT_DIR)) {
    for (const category of fs.readdirSync(OUTPUT_DIR)) {
      const catDir = path.join(OUTPUT_DIR, category);
      if (!fs.statSync(catDir).isDirectory()) continue;
      for (const file of fs.readdirSync(catDir)) {
        if (!file.endsWith('.svg')) continue;
        const iconName = path.basename(file, '.svg');
        if (!newKeys.has(`${category}/${iconName}`)) {
          fs.unlinkSync(path.join(catDir, file));
          console.log(`  ✗ removed ${category}/${iconName}.svg`);
        }
      }
      if (fs.readdirSync(catDir).length === 0) {
        fs.rmdirSync(catDir);
        console.log(`  ✗ removed empty category ${category}/`);
      }
    }
  }

  // Write updated manifest (only icons that were successfully downloaded or unchanged)
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify({ generated_at: new Date().toISOString(), icons: newIcons }, null, 2));
}

main().catch((err) => {
  console.error('Export failed:', err);
  process.exit(1);
});
