/**
 * export-spacing-tokens.js
 *
 * Fetches all spacing variables from Figma and writes two DTCG-format token files:
 *   tokens/spacing-primitives.json  — raw px values + figma-variable
 *   tokens/spacing-aliases.json     — DTCG references, single "All" mode
 *
 * Usage: node scripts/export-spacing-tokens.js
 * Env:   FIGMA_TOKEN, FIGMA_FILE_KEY
 *
 * NOTE: Figma Variables REST API requires Enterprise plan.
 *       This script is kept for future use if the plan is upgraded.
 *       Current export workflow uses MCP Bridge + figma_execute.
 */

'use strict';

const https = require('https');
const fs    = require('fs');
const path  = require('path');

// ─── Config ───────────────────────────────────────────────────────────────────

const FIGMA_TOKEN    = process.env.FIGMA_TOKEN;
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY || 'oWyNqsZJKJYF8SpZsBPb9P';
const TOKEN_VERSION  = require('../package.json').version;

const PRIMITIVES_COLL = 'VariableCollectionId:12:558';
const ALIAS_COLL      = 'VariableCollectionId:426:2159';
const PRIMITIVES_MODE = '12:1';
const ALIAS_MODE      = '426:1';

const OUTPUT_DIR = path.join(__dirname, '..', 'tokens');

// ─── HTTP helper ──────────────────────────────────────────────────────────────

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'X-Figma-Token': FIGMA_TOKEN } }, (res) => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error(`JSON parse error: ${e.message}`)); }
      });
      res.on('error', reject);
    });
  });
}

// ─── Token tree helpers ───────────────────────────────────────────────────────

// "gap/16" → nested { gap: { "16": value } }
function setNested(obj, namePath, value) {
  const parts = namePath.split('/');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!cur[parts[i]]) cur[parts[i]] = {};
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = value;
}

// "gap/16" → "{gap.16}"
function toRef(varName) {
  return `{${varName.replace(/\//g, '.')}}`;
}

// ─── Primitive token builder ──────────────────────────────────────────────────

function buildPrimitives(vars, collection) {
  const root = {
    $metadata: {
      version:      TOKEN_VERSION,
      generated_at: new Date().toISOString(),
      source:       `Figma · ${collection.name} · ${collection.id}`,
      figma_file:   FIGMA_FILE_KEY,
    },
    $type: 'dimension',
  };

  const modeId = PRIMITIVES_MODE;

  for (const v of vars) {
    if (v.resolvedType !== 'FLOAT') continue;

    const val = v.valuesByMode[modeId];
    if (val === undefined || val === null || typeof val === 'object') continue;

    const token = {
      $value:      `${val}px`,
      $extensions: {
        caladan: {
          'figma-variable': v.name,
        },
      },
    };

    if (v.description) token.$description = v.description;

    setNested(root, v.name, token);
  }

  return root;
}

// ─── Alias token builder ──────────────────────────────────────────────────────

function buildAliases(vars, allVars, collection) {
  const root = {
    $metadata: {
      version:      TOKEN_VERSION,
      generated_at: new Date().toISOString(),
      source:       `Figma · ${collection.name} · ${collection.id}`,
      figma_file:   FIGMA_FILE_KEY,
    },
    $type: 'dimension',
  };

  const modeId = ALIAS_MODE;

  for (const v of vars) {
    if (v.resolvedType !== 'FLOAT') continue;

    const val = v.valuesByMode[modeId];
    if (val === undefined || val === null) continue;

    let ref;
    if (typeof val === 'object' && val.type === 'VARIABLE_ALIAS') {
      const target = allVars[val.id];
      if (!target) {
        console.warn(`  ⚠  Unresolved alias: ${v.name} → ${val.id}`);
        continue;
      }
      ref = toRef(target.name);
    } else {
      // Direct value — store as px string
      ref = `${val}px`;
    }

    const token = {
      $value:      ref,
      $extensions: {
        caladan: {
          'figma-variable': v.name,
        },
      },
    };

    if (v.description) token.$description = v.description;

    setNested(root, v.name, token);
  }

  return root;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!FIGMA_TOKEN) throw new Error('FIGMA_TOKEN environment variable is required');

  console.log('\nFetching spacing variables from Figma...');
  const data = await get(
    `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/variables/local`
  );

  if (data.error) throw new Error(`Figma API error: ${JSON.stringify(data)}`);

  const variables   = data.meta.variables;
  const collections = data.meta.variableCollections;

  const primVars  = Object.values(variables).filter(v => v.variableCollectionId === PRIMITIVES_COLL);
  const aliasVars = Object.values(variables).filter(v => v.variableCollectionId === ALIAS_COLL);

  console.log(`  ${primVars.length} primitive variables`);
  console.log(`  ${aliasVars.length} alias variables\n`);

  const primitives = buildPrimitives(primVars, collections[PRIMITIVES_COLL]);
  const aliases    = buildAliases(aliasVars, variables, collections[ALIAS_COLL]);

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const files = [
    { name: 'spacing-primitives.json', content: primitives },
    { name: 'spacing-aliases.json',    content: aliases    },
  ];

  for (const { name, content } of files) {
    const filePath = path.join(OUTPUT_DIR, name);
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
    console.log(`  ✓  ${filePath}`);
  }

  console.log('\n✓  Spacing tokens exported successfully.\n');
}

main().catch(err => {
  console.error('\n✗  Export failed:', err.message);
  process.exit(1);
});
