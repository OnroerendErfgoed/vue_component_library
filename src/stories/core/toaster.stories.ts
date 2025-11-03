import { useUtilStore } from '@stores/utilStore';
import { OeButton, OeToaster } from '@components/core';
import type { Meta, StoryObj } from '@storybook/vue3';
import type { ToastType } from '@models/toast';

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta: Meta<typeof OeToaster> = {
  title: 'Core/Toaster',
  component: OeToaster,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ['autodocs'],

  parameters: {
    layout: 'fullscreen',
    docs: {
      story: {
        height: '250px',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof OeToaster>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */
export const Tabs: Story = {
  parameters: {
    docs: {
      story: {
        height: '500px',
      },
      description: {
        story: 'The component displays all toasts that are pushed to the `UtilStore` in the upper right corner.',
      },
    },
  },
  render: () => ({
    components: {
      OeToaster,
      OeButton,
    },
    setup: () => {
      const utilStore = useUtilStore();
      const showToast = (type: ToastType) => {
        utilStore.addToast({
          title: 'Title',
          content: 'Content',
          type,
        });
      };

      return { showToast };
    },
    template: `
    <oe-button class="vl-u-spacer-bottom" @click="showToast('error')">Push error toast to util store</oe-button><br/>
    <oe-button class="vl-u-spacer-bottom" @click="showToast('success')">Push success toast to util store</oe-button><br/>
    <oe-button class="vl-u-spacer-bottom" @click="showToast('warning')">Push warning toast to util store</oe-button><br/>
    <oe-button class="vl-u-spacer-bottom" @click="showToast">Push default toast to util store</oe-button><br/>
    <oe-toaster />
    `,
  }),
};
