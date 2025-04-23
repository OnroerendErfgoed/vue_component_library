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
          'Wrapper component for VlInputField.\n\n Component handles a number in dot format (xxx.yy) and allows input using comma format (xxx,yy).',
      },
    },
  },
  argTypes: {
    modelValue: {
      description: 'Initial numeric value.',
      table: {
        type: { summary: 'number | null' },
        defaultValue: { summary: 'null' },
      },
    },
    'update:modelValue': {
      action: 'update:modelValue',
      description: 'Event emitted when the input value is updated. Returns the new numeric value or null when cleared.',
      table: {
        type: { summary: 'number | null' },
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
