const https = require('https');
const fs = require('fs');
const path = require('path');

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY;
const FIGMA_ICONS_NODE_ID = process.env.FIGMA_ICONS_NODE_ID;
const OUTPUT_DIR = path.join(__dirname, '..', 'icons', 'svg');

// Fetch JSON from a URL
function fetch(url, headers) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(JSON.parse(data)));
      res.on('error', reject);
    });
  });
}

// Download a file from a URL and save it
function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      // Follow redirects
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        download(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
      file.on('error', reject);
    });
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

// Check if a node ID falls within the icons frame
// Figma node IDs are in the format "106:728" — we fetch the icons frame's
// children and only export components whose node_id is in that list
async function getNodeIdsInFrame(frameNodeId) {
  // Normalize node ID format (replace - with :)
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

  // Recursively collect all node IDs within this frame
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

  // Step 3 — filter to only components inside the icons frame
  const components = allComponents.filter((c) =>
    frameNodeIds.has(c.node_id)
  );
  console.log(`Components inside icons frame: ${components.length}`);

  if (components.length === 0) {
    console.log('No components found inside the icons frame. Check FIGMA_ICONS_NODE_ID.');
    process.exit(1);
  }

  // Print categories found
  const categories = [...new Set(components.map((c) => parseName(c.name).category))];
  console.log('Categories:', categories.join(', '));

  // Step 4 — request SVG export URLs
  const nodeIds = components.map((c) => c.node_id).join(',');
  console.log('Requesting SVG export URLs from Figma...');
  const images = await fetch(
    `https://api.figma.com/v1/images/${FIGMA_FILE_KEY}?ids=${nodeIds}&format=svg`,
    { 'X-Figma-Token': FIGMA_TOKEN }
  );

  const urls = images.images || {};

  // Step 5 — download each SVG
  let downloaded = 0;
  for (const component of components) {
    const { category, name: iconName } = parseName(component.name);
    const url = urls[component.node_id];
    if (!url) {
      console.warn(`  No URL for ${component.name}`);
      continue;
    }

    // Create category folder if needed
    const categoryDir = path.join(OUTPUT_DIR, category);
    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
    }

    const dest = path.join(categoryDir, `${iconName}.svg`);
    await download(url, dest);
    downloaded++;
    console.log(`  ✓ ${category}/${iconName}.svg`);
  }

  console.log(`\nDone! Downloaded ${downloaded} icons.`);
}

main().catch((err) => {
  console.error('Export failed:', err);
  process.exit(1);
});
