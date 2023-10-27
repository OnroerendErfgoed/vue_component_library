import '@/scss/main.scss';
import OeActorWidget from '../../components/smart/OeActorWidget.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta: Meta<typeof OeActorWidget> = {
  title: 'Smart components/OeActorWidget',
  component: OeActorWidget,
  parameters: {
    docs: {
      description: {
        component: `Blabla actor widget.`,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof OeActorWidget>;

export const Default: Story = {
  render: () => ({
    components: {
      OeActorWidget,
    },
    template: `
    <oe-actor-widget id="1" :open="true" />
    `,
  }),
};
