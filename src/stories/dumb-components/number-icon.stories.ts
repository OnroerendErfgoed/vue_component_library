import type { Meta, StoryObj } from '@storybook/vue3';
import NumberIcon from '../../components/dumb/NumberIcon.vue';

const meta: Meta<typeof NumberIcon> = {
  title: 'Dumb components/NumberIcon',
  component: NumberIcon,
  tags: ['autodocs'],
  argTypes: {
    iconHeight: {
      control: 'number',
      description: 'how big you want the font awesome icon to be',
    },
    layerHeight: {
      control: 'number',
      description: 'how big you want the font awesome layer to be',
    },
    value: {
      control: 'text',
      description: 'The text that should be display in the circle',
    },
  },
  args: {
    layerHeight: 1,
    iconHeight: 2,
    value: '4',
  },
  render: (args) => ({
    setup() {
      return { args };
    },
    template: `<number-icon></number-icon>`,
  }),
};

export default meta;
type Story = StoryObj<typeof NumberIcon>;

export const Default: Story = {
  render: (args) => ({
    components: { NumberIcon },
    setup() {
      return { args };
    },
    template: `<number-icon v-bind="args"></number-icon>`,
  }),
};
