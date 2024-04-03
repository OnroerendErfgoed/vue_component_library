import '@/scss/main.scss';
import FilterSelect from '@components/dumb/FilterSelect.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta: Meta<typeof FilterSelect> = {
  title: 'Dumb components/Filter Inputs/FilterSelect',
  component: FilterSelect,
  parameters: {
    docs: {
      description: {
        component:
          'Generic filter input field to enter a select input - used as subcomponent of the `FilterInput` component.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'Selected value',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
    placeholder: {
      control: 'text',
      description: 'Input placeholder value',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
    options: {
      control: 'array',
      description: 'List of options',
      table: {
        type: { summary: 'IOption[]' },
        defaultValue: { summary: '[]' },
      },
    },
    'update:value': {
      description: 'Emits the selected value',
      table: {
        type: { summary: 'string' },
      },
    },
    default: {
      description: 'Default slot to provide custom options layout. In this case property `options` will be ignored',
    },
  },
};

export default meta;
type Story = StoryObj<typeof FilterSelect>;

export const Default: Story = {
  args: {
    options: [
      {
        label: 'Ja',
        value: 'ja',
      },
      {
        label: 'Nee',
        value: 'nee',
      },
    ],
  },
};

export const WithSlot: Story = {
  render: () => ({
    components: { FilterSelect },
    template: `<filter-select>
              <optgroup label="Niet Actief">
                <option value="klad">Klad</option>
                <option value="kladzonderfoto">Klad zonder foto</option>
                </optgroup>
              <optgroup label="Actief">
                <option value="actief">Actief</option>
              </optgroup>
            </filter-select>`,
  }),
};
