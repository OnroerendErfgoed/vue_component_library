import { SystemFields } from '@components/core';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta: Meta<typeof SystemFields> = {
  title: 'Core Module/System Fields',
  component: SystemFields,
  tags: ['autodocs'],
  argTypes: {
    status: { control: 'text' },
    createdBy: { control: 'text' },
    createdAt: { control: 'text' },
    updatedBy: { control: 'text' },
    updatedAt: { control: 'text' },
  },
  args: {
    status: 'Klad',
    createdBy: 'Mr. Foo',
    createdAt: '2023-05-01T13:45:03.427155+02:00',
    updatedBy: 'Miss. Foo',
    updatedAt: '2023-05-24T13:45:03.497579+02:00',
  },
};

export default meta;
type Story = StoryObj<typeof SystemFields>;

export const Default: Story = {};

export const Slot: Story = {
  render: (args) => ({
    setup() {
      return { args };
    },
    components: { SystemFields },
    template: `<SystemFields>
    <template v-if="${'default' in args}" v-slot>${args.default}</template>
    </SystemFields>`,
  }),
  argTypes: {
    default: {
      control: 'text',
    },
  },
  args: {
    default: `<li>Dit is extra content</li>`,
  },
};
