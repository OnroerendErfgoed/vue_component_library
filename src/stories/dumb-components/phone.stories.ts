import { ref } from 'vue';
import OePhone from '@components/forms/dumb/OePhone.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta: Meta<typeof OePhone> = {
  title: 'Forms Module/Phone',
  component: OePhone,
  parameters: {
    docs: {
      story: {
        height: '350px',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    id: {
      description: 'Unique id to link to the input field',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
    modelValue: {
      description: 'Phone number in international format e.g.: +32497284188',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof OePhone>;

export const Default: Story = {
  render: () => ({
    components: {
      OePhone,
    },
    template: `
      <OePhone id="id1" model-value="" />
    `,
  }),
};

export const TwoWayBinding: Story = {
  parameters: {
    docs: {
      story: {
        height: '500px',
      },
      description: {
        story: 'Add a two way binding to benefit from the auto input formatting feature.',
      },
    },
  },
  render: () => ({
    components: {
      OePhone,
    },
    setup() {
      const phoneNumberBE = ref('+32497518852');
      const phoneNumberFR = ref('+33612345678');
      return { phoneNumberBE, phoneNumberFR };
    },
    template: `
      <OePhone id="id1" v-model="phoneNumberBE" />
      <p class="vl-u-spacer-top vl-u-spacer-bottom--large">Model value phone number BE = {{ phoneNumberBE }}</p>
      <OePhone id="id2" v-model="phoneNumberFR" />
      <p class="vl-u-spacer-top">Model value phone number FR = {{ phoneNumberFR }}</p>
    `,
  }),
};
