import '@/scss/main.scss';
import SuspenseAdresCrab from '@components/smart/AdresCrabSuspense.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta: Meta<typeof SuspenseAdresCrab> = {
  title: 'Smart components/Adres-crab',
  // Suspense wrapper needed for components with async setup
  component: SuspenseAdresCrab,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SuspenseAdresCrab>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {};
