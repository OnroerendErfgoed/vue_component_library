import InputPhone from '../../components/dumb/InputPhone.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

import '@/scss/main.scss';
import { ref } from 'vue';

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
        story:
          'The input only emits a model value change when the input is valid - valid when empty or valid format according to selected country.',
      },
    },
  },
  render: () => ({
    components: {
      InputPhone,
    },
    setup() {
      const phonenumberBE = ref('+32497518852');
      const phonenumberFR = ref('+33612345678');
      return { phonenumberBE, phonenumberFR };
    },
    template: `
      <input-phone id="id1" v-model="phonenumberBE" />
      <p class="vl-u-spacer-top vl-u-spacer-bottom--large">Model value phonenumber BE = {{ phonenumberBE }}</p>
      <input-phone id="id2" v-model="phonenumberFR" />
      <p class="vl-u-spacer-top">Model value phonenumber FR = {{ phonenumberFR }}</p>
    `,
  }),
};
