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
    agivGrbUrl: {
      description: 'agiv Grb Url',
      table: {
        type: { summary: 'string' },
      },
    },
    drawPanelEnabled: {
      description: 'Set true to show the drawPanel on the map',
      table: {
        type: { summary: 'boolean' },
      },
    },
    zone: {
      description: 'Emits the created openlayers map',
      table: {
        type: { summary: 'Contour' },
      },
    },
    'map:created': {
      description: 'Emits the created openlayers map',
      table: {
        type: { summary: 'Map' },
      },
    },
    'update:zone': {
      description: 'Emits the created openlayers map',
      table: {
        type: { summary: 'Contour' },
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
      return {
        drawPanelEnabled: true,
        zone: {
          type: 'MultiPolygon',
          coordinates: [
            [
              [
                [152280.89102083, 213106.4520539],
                [152280.86190083, 213106.96597391],
                [152281.36801283, 213107.01896591],
                [152281.29601283, 213108.07598991],
                [152280.82900483, 213108.04405391],
                [152280.67502083, 213113.44104591],
                [152281.17402883, 213113.46894991],
                [152281.12090883, 213114.61294991],
                [152280.60206083, 213114.58901391],
                [152280.57902083, 213115.08392591],
                [152279.82100483, 213115.04904591],
                [152279.48602883, 213124.50306192],
                [152280.51399683, 213124.53499792],
                [152280.52500483, 213124.19394192],
                [152282.02394883, 213124.24104592],
                [152281.96014083, 213125.72603792],
                [152281.15502083, 213125.69992592],
                [152280.97594883, 213131.15304592],
                [152281.76199683, 213131.16494992],
                [152281.69396483, 213132.65397393],
                [152280.22401283, 213132.58702992],
                [152280.22401283, 213132.31797392],
                [152279.25198083, 213132.27899792],
                [152278.84103683, 213141.69902993],
                [152279.59694083, 213141.72194193],
                [152279.59002883, 213142.21096593],
                [152280.05492483, 213142.24507793],
                [152280.02695683, 213143.36706193],
                [152279.50196483, 213143.35202193],
                [152279.34106883, 213148.73896594],
                [152279.80199683, 213148.76699793],
                [152279.78298883, 213149.89896594],
                [152263.08788481, 213149.55278993],
                [152263.10631682, 213148.92654993],
                [152249.21793281, 213148.32110994],
                [152249.19668481, 213148.81486994],
                [152246.2958848, 213151.48085394],
                [152241.9608448, 213151.45307794],
                [152239.0560128, 213148.61070994],
                [152239.1651328, 213144.03765393],
                [152242.3061888, 213141.11470993],
                [152242.5040768, 213141.11790993],
                [152242.5286528, 213140.48238993],
                [152243.6139008, 213112.45493391],
                [152243.01550081, 213112.43125391],
                [152243.0249088, 213104.4780379],
                [152243.53703681, 213104.4969819],
                [152243.54970881, 213104.14498191],
                [152243.5550208, 213103.9970139],
                [152244.6999808, 213104.0420059],
                [152244.68193281, 213104.53397391],
                [152252.17492481, 213104.7899739],
                [152252.18996481, 213104.3330139],
                [152253.32295681, 213104.3630299],
                [152253.30414081, 213104.8640219],
                [152253.79994881, 213104.89211791],
                [152253.75207681, 213106.02600591],
                [152253.24698881, 213106.0049499],
                [152253.22100481, 213106.61307791],
                [152264.21306882, 213107.0210779],
                [152264.25505282, 213106.2249819],
                [152264.73690882, 213106.2509659],
                [152264.77601282, 213105.80898191],
                [152265.92903682, 213105.82402191],
                [152265.92193282, 213106.37397391],
                [152269.90305282, 213106.47099791],
                [152269.99399682, 213104.4900059],
                [152269.78900483, 213104.48002191],
                [152269.82305282, 213103.4720219],
                [152270.81806082, 213103.5140059],
                [152270.80903682, 213103.7289819],
                [152275.04199683, 213103.87298191],
                [152275.05601282, 213103.6781019],
                [152276.05697282, 213103.7160539],
                [152275.96903683, 213104.6800219],
                [152275.76596483, 213104.6750299],
                [152275.68807682, 213106.74293391],
                [152279.81396483, 213106.8840539],
                [152279.83111683, 213106.3869659],
                [152280.89102083, 213106.4520539],
              ],
            ],
            [
              [
                [152341.61601287, 213067.59202188],
                [152336.85895687, 213067.75797388],
                [152329.00903686, 213068.13595788],
                [152320.36295686, 213068.45749388],
                [152317.08897285, 213068.57922188],
                [152313.46298885, 213068.71406988],
                [152310.86503685, 213067.23906188],
                [152310.16346885, 213065.91163788],
                [152309.24398085, 213064.17198988],
                [152302.62996484, 213051.65800587],
                [152293.74702084, 213038.44200586],
                [152293.41697284, 213037.95099786],
                [152290.52295683, 213033.62805386],
                [152289.28858884, 213031.78414986],
                [152291.48199683, 213031.71202185],
                [152295.34407684, 213031.58504586],
                [152297.57799684, 213031.50178185],
                [152339.99700487, 213029.92098185],
                [152341.61601287, 213067.59202188],
              ],
            ],
            [
              [
                [152362.90394889, 213066.79304588],
                [152362.33710089, 213066.81429388],
                [152341.61601287, 213067.59202188],
                [152339.99700487, 213029.92098185],
                [152340.53703687, 213029.89851785],
                [152361.39399689, 213029.03202185],
                [152362.07585289, 213046.08514186],
                [152362.90394889, 213066.79304588],
              ],
            ],
          ],
          crs: {
            type: 'name',
            properties: {
              name: 'urn:ogc:def:crs:EPSG::31370',
            },
          },
        },
      };
    },
    template: `<oe-zoneerder v-model:zone="zone" :draw-panel-enabled="drawPanelEnabled" style="height: 500px"></oe-zoneerder>`,
  }),
};

export const AllControls: Story = {
  render: (args: OeZoneerderProps) => ({
    components: { OeZoneerder },
    setup() {
      return {
        controlConfig: {
          fullscreen: true,
          zoomInOut: true,
          zoomFullExtent: true,
          zoomGeoLocation: true,
          rotate: true,
          zoomSwitcher: true,
        },
      };
    },
    template: `<oe-zoneerder :control-config="controlConfig" style="height: 500px"></oe-zoneerder>`,
  }),
};
