import OeInventarisLoadedLink from '@components/core/dumb/OeInventarisLoadedLink.vue';
import { IInventarisLinkGebeurtenis, IInventarisLinkWaarneming } from '@components/core/models/links';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta: Meta<typeof OeInventarisLoadedLink> = {
  title: 'Core Module/Inventaris Loaded Link',
  component: OeInventarisLoadedLink,
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
type Story = StoryObj<typeof OeInventarisLoadedLink>;

export const Default: Story = {
  render: () => ({
    components: {
      OeInventarisLoadedLink,
    },
    setup() {
      const gebeurtenissen: IInventarisLinkGebeurtenis[] = [];
      const waarnemingen: IInventarisLinkWaarneming[] = [];
      return { gebeurtenissen, waarnemingen };
    },
    template: `
    <div>
    <OeInventarisLoadedLink :gebeurtenissen=gebeurtenissen :waarnemingen="waarnemingen"></OeInventarisLoadedLink>
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
