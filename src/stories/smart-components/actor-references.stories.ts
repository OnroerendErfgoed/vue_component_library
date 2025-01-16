import '@/scss/main.scss';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import OeActorReferences from '@components/smart/OeActorReferences.vue';
import { IReference } from '@models/reference';
import type { Meta, StoryObj } from '@storybook/vue3';

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta: Meta<typeof OeActorReferences> = {
  title: 'Smart components/OeActorReferences',
  component: OeActorReferences,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `Find and list application references for a specified actor (automatic flow) or provide your own reference data (custom flow).`,
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

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: `Automated flow based on id service data and actor uri.`,
      },
    },
  },
};

export const Custom: Story = {
  parameters: {
    docs: {
      description: {
        story: `Custom flow to provide your own reference, when they are provided the automated flow is disabled.`,
      },
    },
  },
  render: () => ({
    components: { OeActorReferences, FontAwesomeIcon },
    setup: () => {
      const koppeling: IReference = {
        query_uri: 'https://dev-id.erfgoed.net/actor/12564/references',
        success: true,
        has_references: true,
        count: 7,
        applications: [
          {
            title: 'Test application',
            uri: 'https://test-application.com',
            service_url: 'https://test-application.com/api',
            success: true,
            hasReferences: true,
            count: 1,
            items: [
              {
                uri: 'https://test-application.com/1',
                title: 'Test item 1',
              },
            ],
          },
          {
            title: 'Test application 2',
            uri: 'https://test-application-2.com',
            service_url: 'https://test-application-2.com/api',
            success: true,
            hasReferences: true,
            count: 6,
            items: [
              {
                uri: 'https://test-application-2.com/1',
                title: 'Test item 2',
              },
              {
                uri: 'https://test-application-2.com/2',
                title: 'Test item 3',
              },
              {
                uri: 'https://test-application-2.com/3',
                title: 'Test item 4',
              },
              {
                uri: 'https://test-application-2.com/4',
                title: 'Test item 5',
              },
              {
                uri: 'https://test-application-2.com/5',
                title: 'Test item 6',
              },
            ],
          },
        ],
      };

      return { koppeling };
    },
    template: `
      <OeActorReferences :koppeling="koppeling">
        <font-awesome-icon class="vl-u-spacer-top--small vl-u-spacer-right--xxsmall icon" :icon="['fas', 'circle-info']" />
        <span>Sommige referenties zijn voor jou niet zichtbaar op basis van je rechten.</span>
      </OeActorReferences>
    `,
  }),
};
