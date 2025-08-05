import '@/scss/main.scss';
import { VlButton } from '@govflanders/vl-ui-design-system-vue3';
import { ref } from 'vue';
import OeAutocomplete from '@components/dumb/OeAutocomplete.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import type { IAutocompleteOption } from '@models/autocomplete';

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
    allowFreeText: {
      control: 'boolean',
      description: 'Allow free text input when no matching results are found',
    },
  },
};

export default meta;
type Story = StoryObj<typeof OeAutocomplete>;

export const Default: Story = {};

export const InitialValue: Story = {
  render: () => ({
    components: {
      OeAutocomplete,
      VlButton,
    },
    setup() {
      const callback = (): Promise<IAutocompleteOption[]> => {
        return new Promise(function (resolve) {
          // Fake delay to show the loader
          setTimeout(function () {
            resolve([
              {
                title: 'Match 1',
              },
              {
                title: 'Match 2',
              },
              {
                title: 'Match 3',
              },
            ]);
          }, 1000);
        });
      };
      const value = ref<IAutocompleteOption>({
        title: 'Match 2',
      });

      return { callback, value };
    },
    template: `
    <OeAutocomplete :callbackFn="callback" :value="value"/>
    <VlButton class="vl-u-spacer-top" @click="() => value = undefined">Reset value</VlButton>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Sets the initial value of the autocomplete to "Match 2" and allows you to reset it to an empty value.',
      },
    },
  },
};

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

export const AllowFreeText: Story = {
  render: () => ({
    components: {
      OeAutocomplete,
    },
    setup() {
      const selectedValue = ref('');
      const callback = (searchTerm: string): Promise<IAutocompleteOption[]> => {
        return new Promise(function (resolve) {
          // Fake delay to show the loader
          setTimeout(function () {
            resolve(
              [
                {
                  title: 'dummy',
                },
              ].filter((s) => s.title.includes(searchTerm))
            );
          }, 3000);
        });
      };

      return { callback, selectedValue };
    },
    template: `
    <oe-autocomplete :callbackFn="callback" allow-free-text @update:value="selectedValue = $event"></oe-autocomplete>
    <br/>
    <p>Selected value:</p>
    <pre>{{selectedValue}}</pre>
     `,
  }),
};
