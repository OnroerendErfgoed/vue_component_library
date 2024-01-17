import '@/scss/main.scss';
import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import InputPhone from '@components/dumb/InputPhone.vue';

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta: Meta<typeof InputPhone> = {
  title: 'Dumb components/InputPhone',
  component: InputPhone,
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
type Story = StoryObj<typeof InputPhone>;

export const Default: Story = {};

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
      InputPhone,
    },
    setup() {
      const phoneNumberBE = ref('+32497518852');
      const phoneNumberFR = ref('+33612345678');
      return { phoneNumberBE, phoneNumberFR };
    },
    template: `
      <input-phone id="id1" v-model="phoneNumberBE" />
      <p class="vl-u-spacer-top vl-u-spacer-bottom--large">Model value phone number BE = {{ phoneNumberBE }}</p>
      <input-phone id="id2" v-model="phoneNumberFR" />
      <p class="vl-u-spacer-top">Model value phone number FR = {{ phoneNumberFR }}</p>
    `,
  }),
};
