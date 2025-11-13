import { ref } from 'vue';
import { ISelectOption, OeSelect } from '@components/forms';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta: Meta<typeof OeSelect> = {
  title: 'Forms Module/Select',
  component: OeSelect,
  tags: ['autodocs'],
  parameters: {
    docs: {
      story: {
        height: '300px',
      },
    },
  },
  argTypes: {
    modelValue: {
      control: 'object',
      description: 'Selected option',
      table: {
        type: { summary: 'ISelectOption' },
        defaultValue: { summary: 'undefined' },
      },
    },
    placeholder: {
      control: 'text',
      description: 'Custom placeholder',
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

      const modelValue = ref<ISelectOption>();
      const customLabel = (option: ISelectOption) => option?.label;
      const setValue = (e: ISelectOption) => {
        modelValue.value = e;
      };

      return { options, modelValue, customLabel, setValue };
    },
    template: `<oe-select :custom-label="customLabel" v-model="modelValue" :options="options"></oe-select>`,
  }),
};

export const Selected: Story = {
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

      const modelValue = ref<ISelectOption>({ label: 'Frankrijk', value: 'Frankrijk' });
      const customLabel = (option: ISelectOption) => option?.label;
      const setValue = (e: ISelectOption) => {
        modelValue.value = e;
      };

      return { options, modelValue, customLabel, setValue };
    },
    template: `<oe-select :custom-label="customLabel" v-model="modelValue" :options="options"></oe-select>`,
  }),
};

export const CustomPlaceholder: Story = {
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

      const modelValue = ref<ISelectOption>();
      const customLabel = (option: ISelectOption) => option?.label;
      const setValue = (e: ISelectOption) => {
        modelValue.value = e;
      };

      return { options, modelValue, customLabel, setValue };
    },
    template: `<oe-select :custom-label="customLabel" v-model="modelValue" :placeholder="'custom placeholder'" :options="options"></oe-select>`,
  }),
};

export const NoMatchingValue: Story = {
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

      const modelValue = ref<ISelectOption>({ label: 'Italië', value: 'Italië' });
      const customLabel = (option: ISelectOption) => option?.label;
      const setValue = (e: ISelectOption) => {
        modelValue.value = e;
      };

      return { options, modelValue, customLabel, setValue };
    },
    template: `<oe-select :custom-label="customLabel" v-model="modelValue" :options="options"></oe-select>`,
  }),
};
