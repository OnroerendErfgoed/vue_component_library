import '@/scss/main.scss';
import { ref } from 'vue';
import OeNumberInput from '@components/dumb/OeNumberInput.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta: Meta<typeof OeNumberInput> = {
  title: 'Dumb components/NumberInput',
  component: OeNumberInput,
  tags: ['autodocs'],
  parameters: {
    docs: {
      story: {
        height: '250px',
      },
      description: {
        component:
          'Wrapper component for VlInputField.\n\n Component handles a number in dot format (xxx.yy) and allows input using comma format (xxx,yy). Supports optional form fields by accepting undefined values.',
      },
    },
  },
  argTypes: {
    modelValue: {
      description: 'Initial numeric value. Can be undefined for optional form fields.',
      table: {
        type: { summary: 'number | null | undefined' },
        defaultValue: { summary: 'undefined' },
      },
    },
    'update:modelValue': {
      action: 'update:modelValue',
      description: 'Event emitted when the input value is updated. Returns the new numeric value, null when cleared, or undefined for optional fields.',
      table: {
        type: { summary: 'number | null | undefined' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof OeNumberInput>;

export const Default: Story = {
  render: () => ({
    components: {
      OeNumberInput,
    },
    setup() {
      const number = ref(12345.67);
      return { number };
    },
    template: `<OeNumberInput v-model="number" />`,
  }),
};

export const TwoWayBinding: Story = {
  render: () => ({
    components: {
      OeNumberInput,
    },
    setup() {
      const number = ref(12345.67);
      return { number };
    },
    template: `
      <OeNumberInput v-model="number" />
      <p class="vl-u-spacer-top vl-u-spacer-bottom--large">modelValue = {{ number }}</p>
    `,
  }),
};

export const OptionalField: Story = {
  render: () => ({
    components: {
      OeNumberInput,
    },
    setup() {
      const optionalNumber = ref<number | null | undefined>(undefined);
      return { optionalNumber };
    },
    template: `
      <div>
        <label>Optional Number Field:</label>
        <OeNumberInput v-model="optionalNumber" />
        <p class="vl-u-spacer-top vl-u-spacer-bottom--large">
          modelValue = {{ optionalNumber === undefined ? 'undefined' : optionalNumber }}
        </p>
      </div>
    `,
  }),
};
