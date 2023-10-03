import '@/scss/main.scss';
import OeAutocomplete from '../../components/dumb/OeAutocomplete.vue';
import type { IAutocompleteOption } from '../../models/autocomplete';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta: Meta<typeof OeAutocomplete> = {
  title: 'Dumb components/Autocomplete',
  component: OeAutocomplete,
  tags: ['autodocs'],
  parameters: {
    docs: {
      story: {
        height: '250px',
      },
    },
  },
  argTypes: {
    id: {
      control: 'text',
      description: 'Unique id for this autocomplete instance',
    },
    value: {
      control: 'object',
      description: 'Selected option',
      table: {
        type: { summary: 'IAutocompleteOption' },
        defaultValue: { summary: 'undefined' },
      },
    },
    autoselect: {
      control: 'boolean',
      description: 'Whether to autoselect the option if only 1 result is left',
    },
    minChars: {
      control: 'number',
      description: 'Number of characters needed before callbackFn is triggered',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    callbackFn: {
      control: 'function',
      description: 'Callback function that provides the options',
      table: {
        type: { summary: 'Should return IAutocompleteOption[]' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof OeAutocomplete>;

export const Default: Story = {};

export const CustomCallbackFunction: Story = {
  render: () => ({
    components: {
      OeAutocomplete,
    },
    setup() {
      const callback = (s: string): Promise<IAutocompleteOption[]> => {
        return new Promise(function (resolve) {
          // Fake delay to show the loader
          setTimeout(function () {
            resolve([
              {
                title: s,
              },
              {
                title: 'dummy',
              },
            ]);
          }, 3000);
        });
      };

      return { callback };
    },
    template: `<oe-autocomplete :callbackFn="callback"></oe-autocomplete>`,
  }),
};

export const Autoselect: Story = {
  render: () => ({
    components: {
      OeAutocomplete,
    },
    setup() {
      const callback = (): Promise<IAutocompleteOption[]> => {
        return new Promise(function (resolve) {
          // Fake delay to show the loader
          setTimeout(function () {
            resolve([
              {
                title: 'dummy',
              },
            ]);
          }, 3000);
        });
      };

      return { callback };
    },
    template: `<oe-autocomplete :callbackFn="callback" autoselect></oe-autocomplete>`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Search for "dum" to have 1 result.',
      },
    },
  },
};

export const MinimumCharacters: Story = {
  args: {
    minChars: 5,
  },
  parameters: {
    docs: {
      description: {
        story: 'Starts searching after entering 5 characters.',
      },
    },
  },
};

export const CustomPlaceholder: Story = {
  args: {
    placeholder: 'My custom placeholder',
  },
};
