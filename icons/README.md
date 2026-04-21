# Icons

A fully automated icon pipeline that exports SVG icons from Figma, optimizes them, and generates ready-to-use React and React Native components. Syncs are triggered manually from GitHub Actions and commit the results directly to the repository.

---

## Folder structure

```
icons/
├── svg/                        # Optimized SVG source files
│   ├── navigation/
│   │   ├── arrow-chevron-up.svg
│   │   └── ...
│   └── actions/
│       └── ...
├── react/                      # React components (web)
│   ├── navigation/
│   │   ├── ArrowChevronUp.tsx
│   │   ├── index.ts
│   │   └── ...
│   ├── index.ts
│   └── ...
├── react-native/               # React Native components
│   ├── navigation/
│   │   ├── ArrowChevronUp.tsx
│   │   ├── index.ts
│   │   └── ...
│   ├── index.ts
│   └── ...
└── manifest.json               # Sync state — do not edit manually
```

---

## How it works

The pipeline runs in four stages:

### 1. Export from Figma

`scripts/export-icons.js` connects to the Figma REST API and downloads every component inside a designated icons frame as an SVG file. Components are expected to follow the naming convention `Category/icon-name` (e.g. `Navigation/arrow-chevron-up`), which maps directly to the folder and file structure in `icons/svg/`.

On each sync the script compares Figma's component list against `manifest.json`:

- **New icons** are downloaded
- **Updated icons** (Figma's `updated_at` timestamp changed) are re-downloaded
- **Unchanged icons** are skipped — no API call, no download
- **Removed icons** are deleted from disk along with any category folder that becomes empty

### 2. Optimize SVGs

`svgo --config svgo.config.js -rf icons/svg` runs [SVGO](https://github.com/svg/svgo) on every file in `icons/svg/`, modifying them in place. The config does the following:

- Applies the standard optimization preset (removes comments, collapses redundant groups, strips unnecessary attributes)
- Rewrites element IDs to short names to prevent conflicts when multiple icons appear on the same page
- Preserves `viewBox` so icons remain scalable
- Converts all hardcoded fill colors to `currentColor` so icons inherit their color from CSS or component props
- Removes unused `<defs>` blocks

### 3. Build React components

`scripts/build-react-icons.js` reads each SVG from `icons/svg/` and uses [SVGR](https://react-svgr.com/) to generate a TypeScript React component. Each component:

- Accepts a `size` prop (default `24`) that sets both `width` and `height`
- Spreads `...props` onto the root `<svg>` element, so any `className`, `style`, `aria-label`, or other SVG prop is forwarded
- Uses `currentColor` for fills — color is controlled via CSS `color` property on the element or a parent

```tsx
import { ArrowChevronUp } from './icons/react/navigation';

<ArrowChevronUp size={20} className="text-indigo-500" />
```

A barrel `index.ts` is written per category and a root `index.ts` re-exports all categories.

### 4. Build React Native components

`scripts/build-react-native-icons.js` reads the same SVGs and generates React Native components using SVGR's native mode with `react-native-svg`. Each component:

- Accepts a `size` prop (default `24`) and a `color` prop (default `#000000`)
- Renders via `react-native-svg` primitives (`Svg`, `Path`, `G`, `ClipPath`, etc.)

```tsx
import { ArrowChevronUp } from './icons/react-native/navigation';

<ArrowChevronUp size={20} color="#6366f1" />
```

---

## Setting up for your project

### 1. Figma structure

Icons must live inside a single dedicated frame in your Figma file. All icon components inside that frame must follow this naming convention:

```
Category/icon-name
```

Examples:
- `Navigation/arrow-chevron-up`
- `Actions/trash`
- `Information/alert-circle`

The category becomes the folder name; the icon name becomes the file name. Icons that don't follow this pattern are placed in an `Other/` category.

### 2. Repository secrets

Add the following secret to your GitHub repository under **Settings → Secrets and variables → Actions**:

| Secret | Description |
|---|---|
| `FIGMA_TOKEN` | A Figma personal access token. Generate one at figma.com → Account settings → Personal access tokens. Requires read access to the file. |

### 3. Workflow environment variables

The workflows pass two additional values as plain environment variables (not secrets — they are not sensitive):

| Variable | Description |
|---|---|
| `FIGMA_FILE_KEY` | The key from your Figma file URL: `figma.com/file/<KEY>/...` |
| `FIGMA_ICONS_NODE_ID` | The node ID of the frame that contains your icons. Right-click the frame in Figma → Copy/Paste as → Copy link, then extract the `node-id` query parameter. |

Update these values in the workflow files under `.github/workflows/`.

### 4. Dependencies

```bash
npm install
```

Required packages:
- `svgo` — SVG optimization
- `@svgr/core` + `@svgr/plugin-jsx` — SVG to React/React Native component conversion
- `react-native-svg` — peer dependency required at runtime in React Native projects

---

## Running a sync

Syncs are triggered manually from GitHub. Navigate to **Actions** in your repository, select the workflow you want to run, and click **Run workflow**.

| Workflow | What it does |
|---|---|
| Icons - SVG (Figma Sync) | Export and optimize SVGs only |
| Icons - SVG + React (Figma Sync) | SVGs + React components |
| Icons - SVG + React + React Native (Figma Sync) | SVGs + both React and React Native components |

Each workflow commits and pushes the results directly to the repository, including an updated `manifest.json`.

---

## Running locally

Export requires a Figma token. Build scripts only need the local SVG files.

```bash
# Export SVGs from Figma
FIGMA_TOKEN=your_token \
FIGMA_FILE_KEY=your_file_key \
FIGMA_ICONS_NODE_ID=106:728 \
node scripts/export-icons.js

# Optimize SVGs
npm run optimize-icons

# Build React components
npm run build-react-icons

# Build React Native components
npm run build-react-native-icons
```

---

## The manifest

`icons/manifest.json` tracks the state of the last sync. It stores the category, name, node ID, and Figma `updated_at` timestamp for every icon. On the next sync, this is used to determine what has changed so that only new and updated icons are downloaded.

Do not edit this file manually. It is committed to the repository so that CI always has the previous sync state available.

---

## Adding, updating, and removing icons

Everything is managed in Figma — no manual file changes are needed.

| Action | What to do |
|---|---|
| **Add an icon** | Create a new component in the icons frame following the `Category/icon-name` naming convention, then run a sync |
| **Update an icon** | Edit the component in Figma, then run a sync — the changed `updated_at` timestamp triggers a re-download |
| **Remove an icon** | Delete the component from the icons frame in Figma, then run a sync — the manifest diff removes the file from the repository |
| **Rename an icon** | Rename the component in Figma, then run a sync — the old file is removed and a new one is created |
| **Move to a different category** | Change the component name prefix in Figma (e.g. `Actions/` → `Navigation/`), then run a sync |
