import type { Meta, StoryObj } from '@storybook/vue3';

import AddressCrab from '@/components/AddressCrab.vue';
import '@/scss/main.scss';

const meta: Meta<typeof AddressCrab> = {
  title: 'Components/Address-crab',
  component: AddressCrab,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AddressCrab>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {};
