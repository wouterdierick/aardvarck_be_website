#!/usr/bin/env node

/**
 * Build and watch Drupal dist artifacts from Storybook component sources.
 *
 * Usage:
 *   node scripts/drupal-dist.js build
 *   node scripts/drupal-dist.js watch
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');

const SOURCE_COMPONENTS_DIR = path.join(ROOT_DIR, 'src/components');
const SOURCE_STYLES_DIR = path.join(ROOT_DIR, 'src/styles');
const OUTPUT_DRUPAL_DIR = path.join(ROOT_DIR, 'dist/drupal');
const OUTPUT_COMPONENTS_DIR = path.join(OUTPUT_DRUPAL_DIR, 'components');
const OUTPUT_STYLES_DIR = path.join(OUTPUT_DRUPAL_DIR, 'styles');
const OUTPUT_STYLES_FILE = path.join(OUTPUT_DRUPAL_DIR, 'styles/main.css');
const COMPONENTS_DO_NOT_EDIT_FILE = path.join(OUTPUT_COMPONENTS_DIR, 'DO_NOT_EDIT.md');
const STYLES_DO_NOT_EDIT_FILE = path.join(OUTPUT_STYLES_DIR, 'DO_NOT_EDIT.md');
const DEFAULT_THEME_DIR = path.resolve(ROOT_DIR, '../web/themes/custom/aardvarck');

const EXCLUDED_SUFFIXES = [
  '.stories.js',
  '.component.yml',
  '.scss',
  '.sass',
  '.css.map',
];

const ALLOWED_EXTENSIONS = new Set([
  '.twig',
  '.js',
  '.css',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
  '.webp',
  '.avif',
  '.ico',
  '.json',
  '.md',
]);

// Identify Storybook story files; those are the source for generated SDC metadata.
function isStoriesFile(filePath) {
  return filePath.toLowerCase().endsWith('.stories.js');
}

// Copy only files that Drupal actually needs at runtime.
function shouldCopyFile(filename) {
  const normalized = filename.toLowerCase();
  if (EXCLUDED_SUFFIXES.some((suffix) => normalized.endsWith(suffix))) {
    return false;
  }

  const extension = path.extname(normalized);
  return ALLOWED_EXTENSIONS.has(extension);
}

// Walk a directory tree and return every file path so later steps can filter
// stories, Twig templates, assets, or styles from one shared traversal helper.
function listFilesRecursive(directory) {
  if (!fs.existsSync(directory)) {
    return [];
  }

  const files = [];
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFilesRecursive(fullPath));
      continue;
    }
    files.push(fullPath);
  }
  return files;
}

// Extract SDC metadata (name, description, props) from Storybook stories.
function parseStoriesMetadata(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');

  // The default export contains the Storybook meta object we mine for SDC data.
  const defaultMatch = content.match(/export\s+default\s+{([\s\S]*?)^}/m);
  if (!defaultMatch) {
    console.warn(`No default export found in ${filePath}`);
    return null;
  }

  const metadata = {};
  // Reuse Storybook's title as the human-friendly component name in Drupal.
  const titleMatch = content.match(/title:\s+['"`]([^'"`]+)['"`]/);
  metadata.title = titleMatch ? titleMatch[1].split('/').pop() : 'Component';

  // Pull the docs description forward so Drupal and Storybook stay aligned.
  const descMatch = content.match(/\/\*\*[\s\S]*?description:\s+['"`]?([^'"`\n]+)/);
  metadata.description = descMatch ? descMatch[1] : `Component: ${metadata.title}`;

  // Turn the story filename into a PascalCase component name for the SDC file.
  const fileName = path.basename(filePath, '.stories.js');
  metadata.name = fileName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
  metadata.fileName = `${fileName}.stories.js`;

  const argTypesMatch = content.match(/argTypes:\s+{([\s\S]*?)^  }/m);
  metadata.props = {};

  if (!argTypesMatch) {
    return metadata;
  }

  // Each top-level argType becomes one SDC prop definition.
  const argTypesContent = argTypesMatch[1];
  const propMatches = argTypesContent.matchAll(/^(\s{4})(\w+):\s+{([\s\S]*?)^\1},/gm);

  for (const match of propMatches) {
    const propName = match[2];
    const propConfig = match[3];

    // Infer a simple JSON Schema type from the Storybook control config.
    let propType = 'string';
    if (propConfig.includes('checkbox') || propConfig.includes('boolean')) {
      propType = 'boolean';
    }
    else if (propConfig.includes('number')) {
      propType = 'number';
    }
    else if (propConfig.includes("type: 'object'") || propConfig.includes('type: "object"')) {
      propType = 'object';
    }

    const propDescMatch = propConfig.match(/description:\s+['"`]([^'"`]+)['"`]/);
    const description = propDescMatch ? propDescMatch[1] : `The ${propName} prop`;

    // Storybook represents both objects and arrays with its `object` control.
    // The component description makes array props explicit for the SDC schema.
    if (/^array\b/i.test(description)) {
      propType = 'array';
    }

    metadata.props[propName] = {
      type: propType,
      description,
    };

    if (propType === 'array') {
      metadata.props[propName].items = { type: 'object' };
    }
  }

  return metadata;
}

// Convert parsed story metadata to Drupal SDC YAML content.
function createComponentYaml(metadata) {
  // Drupal may pass omitted `attributes` props as an empty string, so the
  // generated schema needs to accept both the intended object shape and that
  // empty fallback value.
  const properties = Object.fromEntries(
    Object.entries(metadata.props || {}).map(([propName, propDefinition]) => {
      if (propName !== 'attributes' || propDefinition.type !== 'object') {
        return [propName, propDefinition];
      }

      return [
        propName,
        {
          ...propDefinition,
          type: ['object', 'string'],
        },
      ];
    })
  );
  const componentYAML = {
    name: metadata.name,
    description: metadata.description,
    props: {
      type: 'object',
      properties,
    },
  };

  if (Object.keys(properties).length > 0) {
    componentYAML.slots = {
      default: {
        description: 'Default slot content',
      },
    };
  }

  // Prefix generated files with provenance so manual edits do not get lost.
  const yamlContent = yaml.dump(componentYAML, { lineWidth: -1 });
  const comment = `# AUTO-GENERATED FILE
# Generated from ${metadata.fileName}
# Regenerate with: npm run build:drupal
#

`;

  return comment + yamlContent;
}

// Create a directory and any missing parents before writing output into it.
function ensureDirectory(directory) {
  fs.mkdirSync(directory, { recursive: true });
}

// Decide where generated Drupal artifacts should be mirrored.
// An env override wins; otherwise we target the local theme in this repo.
function resolveThemeSyncDirectory() {
  const configuredPath = process.env.DRUPAL_THEME_DIR;
  if (configuredPath) {
    return path.isAbsolute(configuredPath)
      ? configuredPath
      : path.resolve(ROOT_DIR, configuredPath);
  }

  return DEFAULT_THEME_DIR;
}

// Add short README files so it's obvious these folders are generated output.
function writeGeneratedReadmes() {
  const readmeFileContent = `# Auto-generated

This directory is generated by \`storybook/scripts/drupal-dist.js\`.
Do not edit files in this folder manually.
Use \`npm run build:drupal\` or \`npm run watch:drupal\` inside the storybook directory.
`;

  fs.writeFileSync(COMPONENTS_DO_NOT_EDIT_FILE, readmeFileContent, 'utf-8');
  fs.writeFileSync(STYLES_DO_NOT_EDIT_FILE, readmeFileContent, 'utf-8');
}

// Copy Twig/assets/javascript sources into dist/drupal/components.
function copyDrupalSourceFiles() {
  const allSourceFiles = listFilesRecursive(SOURCE_COMPONENTS_DIR);

  for (const sourceFile of allSourceFiles) {
    const relativePath = path.relative(SOURCE_COMPONENTS_DIR, sourceFile);
    const fileName = path.basename(sourceFile);
    // Skip authoring-only files such as stories, Sass sources, and generated
    // metadata; Drupal only needs runtime templates, assets, and JS.
    if (!shouldCopyFile(fileName)) {
      continue;
    }

    const destination = path.join(OUTPUT_COMPONENTS_DIR, relativePath);
    ensureDirectory(path.dirname(destination));
    fs.copyFileSync(sourceFile, destination);
  }
}

// Generate all *.component.yml files in the dist component tree.
function generateComponentMetadata() {
  // Metadata is derived from Storybook stories instead of Twig so component
  // documentation, controls, and Drupal schemas stay driven from one source.
  const storiesFiles = listFilesRecursive(SOURCE_COMPONENTS_DIR).filter(isStoriesFile);
  let generated = 0;

  for (const storiesFile of storiesFiles) {
    const metadata = parseStoriesMetadata(storiesFile);
    if (!metadata) {
      continue;
    }

    const componentDir = path.dirname(storiesFile);
    const relativeDir = path.relative(SOURCE_COMPONENTS_DIR, componentDir);
    const componentName = path.basename(componentDir);
    const destinationDir = path.join(OUTPUT_COMPONENTS_DIR, relativeDir);
    const destinationFile = path.join(destinationDir, `${componentName}.component.yml`);

    ensureDirectory(destinationDir);
    fs.writeFileSync(destinationFile, createComponentYaml(metadata), 'utf-8');
    generated++;
  }

  console.log(`Generated ${generated} .component.yml file(s).`);
}

// Run a shell command (used for Sass builds) and fail on non-zero exit codes.
function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    // Prefer project-local binaries so the script works without global installs.
    const localBinPath = path.join(ROOT_DIR, 'node_modules', '.bin');
    const envPath = process.env.PATH || '';
    const child = spawn(command, args, {
      cwd: ROOT_DIR,
      env: {
        ...process.env,
        PATH: `${localBinPath}${path.delimiter}${envPath}`,
      },
      stdio: 'inherit',
    });

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`Command failed: ${command} ${args.join(' ')}`));
    });
  });
}

// Mirror the generated dist/drupal output to the Drupal theme, so Drupal can
// render the same exported files without a separate manual sync step.
function syncDistToDrupalTheme(themeDirectory) {
  if (!fs.existsSync(themeDirectory)) {
    console.log(`Skipping Drupal theme sync (not found): ${themeDirectory}`);
    return;
  }

  const themeComponentsDir = path.join(themeDirectory, 'components');
  const themeStylesDir = path.join(themeDirectory, 'styles');

  // Replace the whole generated tree so stale component files disappear too.
  fs.rmSync(themeComponentsDir, { recursive: true, force: true });
  fs.rmSync(themeStylesDir, { recursive: true, force: true });
  fs.cpSync(OUTPUT_COMPONENTS_DIR, themeComponentsDir, { recursive: true });
  fs.cpSync(OUTPUT_STYLES_DIR, themeStylesDir, { recursive: true });

  console.log(`Synced dist/drupal to Drupal theme: ${themeDirectory}`);
}

// Full Drupal export build:
// 1) clean dist folder
// 2) copy component sources
// 3) compile styles
// 4) generate SDC metadata
async function buildDrupalDist() {
  // Start from a clean export so removed source files do not linger in dist.
  fs.rmSync(OUTPUT_DRUPAL_DIR, { recursive: true, force: true });
  ensureDirectory(OUTPUT_COMPONENTS_DIR);
  ensureDirectory(OUTPUT_STYLES_DIR);

  copyDrupalSourceFiles();

  // Build the global stylesheet that Drupal includes once for shared tokens
  // and layout rules.
  await runCommand('sass', [
    '--load-path=src/styles',
    'src/styles/main.scss',
    'dist/drupal/styles/main.css',
    '--style=compressed',
    '--no-source-map',
  ]);

  // Compile component-scoped Sass in place so each exported component keeps
  // its own colocated CSS next to the Twig file.
  await runCommand('sass', [
    '--load-path=src/styles',
    'src/components:dist/drupal/components',
    '--style=compressed',
    '--no-source-map',
  ]);

  generateComponentMetadata();
  writeGeneratedReadmes();
  syncDistToDrupalTheme(resolveThemeSyncDirectory());
}

// Watch mode that rebuilds dist on source changes with debounce + queueing.
async function watchDrupalDist() {
  console.log('Initial Drupal dist build...');
  await buildDrupalDist();
  console.log('Drupal dist is ready. Watching for changes...\n');

  let debounceTimer = null;
  let isBuilding = false;
  let pendingBuild = false;
  let dirtyReason = 'file change';

  // Serialize rebuilds so overlapping fs events never run concurrent Sass or
  // file-copy jobs against the same output directory.
  const runBuild = async () => {
    if (isBuilding) {
      pendingBuild = true;
      return;
    }

    isBuilding = true;
    try {
      console.log(`Rebuilding Drupal dist (${dirtyReason})...`);
      await buildDrupalDist();
      console.log('Drupal dist updated.\n');
    } catch (error) {
      console.error(`Drupal dist build failed: ${error.message}\n`);
    } finally {
      isBuilding = false;
      if (pendingBuild) {
        pendingBuild = false;
        await runBuild();
      }
    }
  };

  // Debounce noisy watch events, especially when editors save multiple files or
  // when Sass compilation itself touches neighboring files.
  const scheduleBuild = (reason) => {
    dirtyReason = reason;
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(() => {
      runBuild().catch((error) => {
        console.error(`Unexpected watch error: ${error.message}`);
      });
    }, 180);
  };

  // Watch component source files, Twig, assets, and colocated scripts.
  const componentWatcher = fs.watch(
    SOURCE_COMPONENTS_DIR,
    { recursive: true },
    (_eventType, filename) => {
      scheduleBuild(filename ? `components/${filename}` : 'components update');
    }
  );

  // Watch shared Sass sources that feed the exported global stylesheet.
  const stylesWatcher = fs.watch(
    SOURCE_STYLES_DIR,
    { recursive: true },
    (_eventType, filename) => {
      scheduleBuild(filename ? `styles/${filename}` : 'styles update');
    }
  );

  // Close native file watchers explicitly so Ctrl+C exits cleanly.
  process.on('SIGINT', () => {
    componentWatcher.close();
    stylesWatcher.close();
    console.log('\nStopped Drupal dist watcher.');
    process.exit(0);
  });
}

// Dispatch the script into one-shot build mode or long-running watch mode.
async function main() {
  const mode = (process.argv[2] || 'build').toLowerCase();

  if (mode === 'build') {
    await buildDrupalDist();
    return;
  }

  if (mode === 'watch') {
    await watchDrupalDist();
    return;
  }

  console.error('Usage: node scripts/drupal-dist.js <build|watch>');
  process.exit(1);
}

// Surface only the error message to keep CLI output concise for developers.
main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
