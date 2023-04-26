import type { Meta, StoryObj } from '@storybook/vue3';

import SuspenseAddressCrab from '@/components/smart/AddressCrabSuspense.vue';
import '@/scss/main.scss';

const meta: Meta<typeof SuspenseAddressCrab> = {
  title: 'Smart components/Address-crab',
  // Suspense wrapper needed for components with async setup
  component: SuspenseAddressCrab,
  tags: ['autodocs'],
    
};

export default meta;
type Story = StoryObj<typeof SuspenseAddressCrab>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {};
