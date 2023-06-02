import AppHeader from './AppHeader.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta: Meta<typeof AppHeader> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/vue/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Example stories/Header',
  component: AppHeader,
  render: (args) => ({
    components: { AppHeader },
    setup() {
      return { args };
    },
    template: '<AppHeader :user="args.user" />',
  }),
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AppHeader>;

export const LoggedIn: Story = {
  args: {
    user: {
      name: 'Jane Doe',
    },
  },
};

export const LoggedOut: Story = {
  args: {
    user: null,
  },
};
