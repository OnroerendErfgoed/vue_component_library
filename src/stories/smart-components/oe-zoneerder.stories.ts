import { OeZoneerder } from '@/components';
import type { Meta, StoryObj } from '@storybook/vue3';
import type { OeZoneerderProps } from '@/models';

const meta: Meta<typeof OeZoneerder> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/vue/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Smart components/OeZoneerder',
  component: OeZoneerder,
  render: (args: OeZoneerderProps) => ({
    components: { OeZoneerder },
    setup() {
      return { args };
    },
    template: '<oe-zoneerder v-bind="args" style="height: 500px"/>',
  }),
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Component wrapping an <a href="http://openlayers.org" target="_blank">openlayers</a> map with configurable ' +
          'layers and map controls',
      },
    },
  },
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
    controlConfig: {
      control: 'object',
      description: 'Configure which controls are visible on the openlayers map',
      table: {
        type: { summary: 'controlConfig' },
      },
    },
    layerConfig: {
      control: 'object',
      description: 'Configure which layers are visible on the openlayers map',
      table: {
        type: { summary: 'layerConfig' },
      },
    },
    beschermingenWmsUrl: {
      description: 'Beschermingen WMS Service URL',
      table: {
        type: { summary: 'string' },
      },
    },
    api: {
      description: 'API base URL',
      table: {
        type: { summary: 'string' },
      },
    },
    'map:created': {
      description: 'Emits the created openlayers map',
      table: {
        type: { summary: 'object' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof OeZoneerder>;

export const Default: Story = {};

export const DrawZone: Story = {
  render: (args: OeZoneerderProps) => ({
    components: { OeZoneerder },
    setup() {
      return { args };
    },
    template: `<oe-zoneerder v-bind="args" style="height: 500px"></oe-zoneerder>`,
  }),
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ['autodocs'],
};
