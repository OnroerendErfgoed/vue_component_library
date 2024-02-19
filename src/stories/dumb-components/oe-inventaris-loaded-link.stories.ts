import '@/scss/main.scss';
import OEInventarisLoadedLink from '@components/dumb/OeInventarisLoadedLink.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import type { IInventarisLinkGebeurtenis, IInventarisLinkWaarneming } from '@models/links';

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta: Meta<typeof OEInventarisLoadedLink> = {
  title: 'Dumb components/OeInventarisLoadedLink',
  component: OEInventarisLoadedLink,
  parameters: {
    docs: {
      description: {
        component: `Component to show loaded inventaris waarnemingen/gebeurtenissen`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    gebeurtenissen: {
      description: 'Array of gebeurtenissen',
      table: {
        type: { summary: 'Array of gebeurtenissen' },
      },
    },
    waarnemingen: {
      description: 'Array of waarnemingen',
      table: {
        type: { summary: 'Array of waarnemingen' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof OEInventarisLoadedLink>;

export const Default: Story = {
  render: () => ({
    components: {
      OEInventarisLoadedLink,
    },
    setup() {
      const gebeurtenissen: IInventarisLinkGebeurtenis[] = [];
      const waarnemingen: IInventarisLinkWaarneming[] = [];
      return { gebeurtenissen, waarnemingen };
    },
    template: `
    <div>
    <OEInventarisLoadedLink :gebeurtenissen=gebeurtenissen :waarnemingen="waarnemingen"></OEInventarisLoadedLink>
    </div>
    `,
  }),
};

export const GebeurtenissenAndWaarnemingen: Story = {
  args: {
    waarnemingen: [
      { id: 1, naam: 'Kardinaal Mercierlaan 66, Leuven', uri: 'https://dev-id.erfgoed.net/waarnemingen/1' },
    ] as IInventarisLinkWaarneming[],
    gebeurtenissen: [
      {
        id: 1,
        titel: 'Toevalsvondst Kardinaal Mercierlaan 66, Leuven',
        uri: 'https://dev-id.erfgoed.net/gebeurtenissen/1',
      },
    ] as IInventarisLinkGebeurtenis[],
  },
};
