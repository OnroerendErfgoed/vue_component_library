import type { Meta, StoryObj } from '@storybook/vue3';
import LockIcon from '../../components/dumb/LockIcon.vue';

const meta: Meta<typeof LockIcon> = {
  title: 'Dumb components/LockIcon',
  component: LockIcon,
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
  },
  args: {
    layerHeight: 1,
    iconHeight: 2,
  },
  render: (args) => ({
    setup() {
      return { args };
    },
    template: `<lock-icon></lock-icon>`,
  }),
};

export default meta;
type Story = StoryObj<typeof LockIcon>;

export const Default: Story = {
  render: (args) => ({
    components: { LockIcon },
    setup() {
      return { args };
    },
    template: `<lock-icon v-bind="args"></lock-icon>`,
  }),
};
