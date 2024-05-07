import '@/scss/main.scss';
import OeActorReferences from '@components/smart/OeActorReferences.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta: Meta<typeof OeActorReferences> = {
  title: 'Smart components/OeActorReferences',
  component: OeActorReferences,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `Find and list application references for a specified actor.`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    idServiceUrl: 'https://dev-id.erfgoed.net',
    actorUri: 'https://dev-id.erfgoed.net/actoren/12564',
  },
  argTypes: {
    actorUri: {
      description: 'Uri of the actor',
      table: {
        type: { summary: 'string' },
      },
    },
    idServiceUrl: {
      description: 'API id service base url',
      table: {
        type: { summary: 'string' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof OeActorReferences>;

export const Default: Story = {};
