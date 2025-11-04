import { OeFilterSelect } from '@/forms';
import type { Meta, StoryObj } from '@storybook/vue3';

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta: Meta<typeof OeFilterSelect> = {
  title: 'Forms/Filter Inputs/Filter Select',
  component: OeFilterSelect,
  parameters: {
    docs: {
      description: {
        component:
          'Generic filter input field to enter a select input - used as subcomponent of the `OeFilter` component.',
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
type Story = StoryObj<typeof OeFilterSelect>;

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
    components: { OeFilterSelect },
    template: `<oe-filter-select>
              <optgroup label="Niet Actief">
                <option value="klad">Klad</option>
                <option value="kladzonderfoto">Klad zonder foto</option>
                </optgroup>
              <optgroup label="Actief">
                <option value="actief">Actief</option>
              </optgroup>
            </oe-filter-select>`,
  }),
};
