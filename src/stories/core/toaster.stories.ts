import { useUtilStore } from '@stores/utilStore';
import { defineComponent } from 'vue';
import { OeButton, OeToaster } from '@components/core';
import type { Meta, StoryObj } from '@storybook/vue3';
import type { ToastType } from '@models/toast';

const ToastDemo = defineComponent({
  name: 'ToastDemo',
  components: { OeButton, OeToaster },
  props: {
    title: { type: String, default: 'Title' },
    content: { type: String, default: 'Content' },
    closeOnClick: { type: Boolean, default: false },
  },
  setup(props) {
    const utilStore = useUtilStore();

    const showToast = (type: ToastType) => {
      utilStore.addToast({
        title: props.title,
        content: props.content,
        type,
      });
    };

    return { showToast };
  },
  template: `
    <oe-button class="vl-u-spacer-bottom" @click="showToast('error')">Push error toast</oe-button><br/>
    <oe-button class="vl-u-spacer-bottom" @click="showToast('success')">Push success toast</oe-button><br/>
    <oe-button class="vl-u-spacer-bottom" @click="showToast('warning')">Push warning toast</oe-button><br/>
    <oe-button class="vl-u-spacer-bottom" @click="showToast()">Push default toast</oe-button><br/>
    <oe-toaster :close-on-click="closeOnClick" />
  `,
});

const meta = {
  title: 'Core Module/Toaster',
  component: ToastDemo,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    content: { control: 'text' },
    closeOnClick: {
      control: 'boolean',
      description: 'Whether the toast should close when clicked',
    },
  },
  args: {
    title: 'Title',
    content: 'Content',
    closeOnClick: false,
  },
  parameters: {
    layout: 'fullscreen',
    docs: { story: { height: '250px' } },
  },
} satisfies Meta<typeof ToastDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tabs: Story = {
  parameters: {
    docs: {
      story: { height: '500px' },
      description: {
        story: 'The component displays all toasts that are pushed to the `UtilStore` in the upper right corner.',
      },
    },
  },
};
