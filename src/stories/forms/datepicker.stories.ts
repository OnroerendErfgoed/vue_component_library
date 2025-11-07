import '@/scss/main.scss';
import { ref } from 'vue';
import { OeDatepicker } from '@components/forms';
import type { Meta, StoryObj } from '@storybook/vue3';

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta: Meta<typeof OeDatepicker> = {
  title: 'Forms Module/Datepicker',
  component: OeDatepicker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Wrapper component for VlDatepicker.\n\n Component handles a date in API format (yyyy-MM-dd) and allows input using visual format (dd-MM-yyyy).',
      },
    },
  },
  argTypes: {
    modelValue: {
      description: 'Date in API format (yyyy-MM-dd)',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: null },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof OeDatepicker>;

export const Default: Story = {};

export const TwoWayBinding: Story = {
  render: () => ({
    components: {
      OeDatepicker,
    },
    setup() {
      const date = ref('2024-07-16');
      return { date };
    },
    template: `
      <oe-datepicker v-model="date" />
      <p class="vl-u-spacer-top vl-u-spacer-bottom--large">Model value = {{ date }}</p>
    `,
  }),
};
