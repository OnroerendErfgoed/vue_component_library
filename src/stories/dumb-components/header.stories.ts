import '@/scss/main.scss';

import OeHeader from '@components/dumb/OeHeader.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta: Meta<typeof OeHeader> = {
  title: 'Dumb components/Header',
  component: OeHeader,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
    appName: {
      type: 'string',
      description: 'Name of application',
    },
    appUrl: {
      type: 'string',
      description: 'Url to navigate to when clicking on appName',
    },
    username: {
      type: 'string',
      description: 'Name of the logged in user',
    },
    role: {
      type: 'string',
      description: 'Role of the logged in user',
    },
    logoUrl: {
      type: 'string',
      description: 'Url where the logo link should refer to',
    },
    actions: {
      control: 'text',
      description: 'Named slot to pass in some action buttons into the header',
    },
    showLogoutShortcut: {
      control: 'boolean',
      description: 'Show shortcut button to logout without having to open the dropdown',
    },
  },
  args: {
    username: 'Doe, John',
    role: 'Beheerder',
    appName: 'Application',
    appUrl: '/',
  },
  parameters: {
    docs: {
      story: {
        height: '250px',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof OeHeader>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */
export const Default: Story = {};

export const SlotActions: Story = {
  render: (args) => ({
    components: {
      OeHeader,
    },
    setup() {
      return { args };
    },
    template: `
      <oe-header v-bind="args">
        <template v-slot:actions>
          <div v-if="args.actions" v-html="args.actions"></div>
        </template>
      </oe-header>
    `,
  }),
  args: {
    actions: `<button mod-naked class="vl-button">Action1</button>
<button mod-naked class="vl-button">Action2</button>
<button mod-naked class="vl-button">Action3</button>`,
  },
};

export const WithLogoutShortcut: Story = {
  args: {
    showLogoutShortcut: true,
  },
};
