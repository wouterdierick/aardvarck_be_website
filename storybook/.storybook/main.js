// This file has been automatically migrated to valid ESM format by Storybook.


/** @type { import('@storybook/html-vite').StorybookConfig } */

import remarkGfm from 'remark-gfm';
import { mergeConfig } from 'vite';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
  framework: getAbsolutePath("@storybook/html-vite"),
  features: {
    sidebarOnboardingChecklist: false,
  },
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  staticDirs: [
    '../src/assets',
    {
      from: '../src/components/components/icon/icons',
      to: '/icons',
    },
  ],
  addons: [
    getAbsolutePath("@chromatic-com/storybook"),
    getAbsolutePath("@storybook/addon-vitest"),
    getAbsolutePath("@storybook/addon-a11y"),
    {
      name: getAbsolutePath("@storybook/addon-docs"),
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
  ],
  docs: {
    defaultName: 'Documentation',
    docsMode: false
  },
  async viteFinal(baseConfig) {
    return mergeConfig(baseConfig, {
      css: {
        preprocessorOptions: {
          scss: {
            loadPaths: [
              path.resolve(__dirname, '../src/styles')
            ],
          },
        },
      },
    });
  },
};

export default config;

function getAbsolutePath(value) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
