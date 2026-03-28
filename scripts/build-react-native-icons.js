const fs = require('fs');
const path = require('path');
const { transform } = require('@svgr/core');

const SVG_DIR = path.join(__dirname, '..', 'icons', 'svg');
const RN_DIR = path.join(__dirname, '..', 'icons', 'react-native');

// Convert kebab-case to PascalCase
// "arrow-chevron-up" → "ArrowChevronUp"
function toPascalCase(str) {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

async function main() {
  // Clean and recreate react-native output directory
  if (fs.existsSync(RN_DIR)) {
    fs.rmSync(RN_DIR, { recursive: true });
  }
  fs.mkdirSync(RN_DIR, { recursive: true });

  const categories = fs.readdirSync(SVG_DIR).filter((f) =>
    fs.statSync(path.join(SVG_DIR, f)).isDirectory()
  );

  for (const category of categories) {
    const categoryDir = path.join(SVG_DIR, category);
    const rnCategoryDir = path.join(RN_DIR, category);
    fs.mkdirSync(rnCategoryDir, { recursive: true });

    const svgFiles = fs.readdirSync(categoryDir).filter((f) => f.endsWith('.svg'));
    const categoryExports = [];

    for (const svgFile of svgFiles) {
      const iconName = path.basename(svgFile, '.svg');
      const componentName = toPascalCase(iconName);
      const svgCode = fs.readFileSync(path.join(categoryDir, svgFile), 'utf8');

      // Convert SVG to React Native component using SVGR native mode
      const jsxCode = await transform(
        svgCode,
        {
          plugins: ['@svgr/plugin-jsx'],
          native: true,
          typescript: true,
          template: ({ componentName, jsx }, { tpl }) => tpl`
            import * as React from 'react';
            import Svg, { Path, G, ClipPath, Rect, Circle, Defs } from 'react-native-svg';

            interface Props {
              size?: number;
              color?: string;
            }

            const ${componentName} = ({ size = 24, color = '#000000', ...props }: Props) => (
              ${jsx}
            );

            export default ${componentName};
          `,
        },
        { componentName }
      );

      // Replace currentColor with the color prop
      const finalCode = jsxCode.replace(/currentColor/g, '{color}');

      const outputFile = path.join(rnCategoryDir, `${componentName}.tsx`);
      fs.writeFileSync(outputFile, finalCode);
      categoryExports.push(componentName);
      console.log(`  ✓ ${category}/${componentName}.tsx`);
    }

    // Write category index.ts
    const categoryIndex = categoryExports
      .map((name) => `export { default as ${name} } from './${name}';`)
      .join('\n');
    fs.writeFileSync(path.join(rnCategoryDir, 'index.ts'), categoryIndex + '\n');
  }

  // Write root index.ts
  const rootIndex = categories
    .map((cat) => `export * from './${cat}';`)
    .join('\n');
  fs.writeFileSync(path.join(RN_DIR, 'index.ts'), rootIndex + '\n');

  console.log(`\nDone! Generated React Native components for ${categories.length} categories.`);
}

main().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});
