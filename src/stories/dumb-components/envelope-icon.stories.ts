import EnvelopeIcon from '../../components/dumb/EnvelopeIcon.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta: Meta<typeof EnvelopeIcon> = {
  title: 'Dumb components/EnvelopeIcon',
  component: EnvelopeIcon,
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
    template: `<envelope-icon></envelope-icon>`,
  }),
};

export default meta;
type Story = StoryObj<typeof EnvelopeIcon>;

export const Default: Story = {
  render: (args) => ({
    components: { EnvelopeIcon },
    setup() {
      return { args };
    },
    template: `<envelope-icon v-bind="args"></envelope-icon>`,
  }),
};
