import OeAutocomplete from '../../components/dumb/OeAutocomplete.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

import '@/scss/main.scss';

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta: Meta<typeof OeAutocomplete> = {
  title: 'Dumb components/Autocomplete',
  component: OeAutocomplete,
  tags: ['autodocs'],
  argTypes: {
    id: {
      control: 'text',
      description: 'Unique id for this autocomplete instance',
    },
  },
};

export default meta;
type Story = StoryObj<typeof OeAutocomplete>;

export const Default: Story = {
  render: () => ({
    components: {
      OeAutocomplete,
    },
    setup() {
      const callback = (s: string) =>
        Promise.resolve([
          {
            title: s,
          },
          {
            title: 'dummy',
          },
        ]);

      return { callback };
    },
    template: `<oe-autocomplete :callbackFn="callback"></oe-autocomplete>`,
  }),
  parameters: {
    docs: {
      story: {
        height: '250px',
      },
    },
  },
  args: {
    id: 'test',
  },
};
