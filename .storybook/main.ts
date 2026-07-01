import type { StorybookConfig } from '@storybook/vue3-vite';
import type { UserConfig } from 'vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-docs'],
  framework: {
    name: '@storybook/vue3-vite',
    options: {
      builder: {
        viteConfigPath: './.storybook/vite.config.ts',
      },
    },
  },
  docs: {
    autodocs: 'tag',
  },
  viteFinal: async (config: UserConfig) => {
    // vite 8 defaults to lightningcss which rejects old IE CSS hacks in the govflanders design system
    config.build = { ...config.build, cssMinify: 'esbuild' };
    return config;
  },
};

export default config;
