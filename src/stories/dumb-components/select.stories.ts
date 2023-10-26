import '@/scss/main.scss';
import OeSelect from '../../components/dumb/OeSelect.vue';
import { ref } from 'vue';
// import type { IAutocompleteOption } from '../../models/autocomplete';
import type { Meta, StoryObj } from '@storybook/vue3';
import type { ISelectOption } from '@models/select';

const meta: Meta<typeof OeSelect> = {
  title: 'Dumb components/Select',
  component: OeSelect,
  tags: ['autodocs'],
  parameters: {
    docs: {
      story: {
        height: '250px',
      },
    },
  },
  argTypes: {
    model: {
      control: 'object',
      description: 'Selected option',
      table: {
        type: { summary: 'ISelectOption' },
        defaultValue: { summary: 'undefined' },
      },
    },
    options: {
      control: 'object',
      description: 'options array',
      table: {
        type: { summary: 'ISelectOption Array' },
        defaultValue: { summary: 'undefined' },
      },
    },
    'update:model-value': {
      description: 'Emits the selected value',
      table: {
        type: { summary: 'string' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof OeSelect>;

export const Default: Story = {
  render: () => ({
    components: {
      OeSelect,
    },
    setup() {
      const options = [
        { label: 'België', value: 'België' },
        { label: 'Frankrijk', value: 'Frankrijk' },
        {
          label:
            'Duitsland - Land in Centraal-Europa. Het heeft een grondgebied van 357.022 km² en grenst in het noorden aan de Oostzee.',
          value: 'Duitsland',
        },
      ] as ISelectOption[];

      const model = ref<ISelectOption>({ label: 'Frankrijk', value: 'Frankrijk' });
      const customLabel = (option: ISelectOption) => option?.label;
      const setValue = (e: ISelectOption) => {
        model.value = e;
      };

      return { options, model, customLabel, setValue };
    },
    template: `<oe-select @update:model-value="setValue($event)" :custom-label="customLabel" :model="model" :options="options"></oe-select>`,
  }),
};
