import '@/scss/main.scss';
import { AdresCrab } from '@components/index';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta: Meta<typeof AdresCrab> = {
  title: 'Smart components/Adres-crab',
  component: AdresCrab,
  tags: ['autodocs'],
  render: (args) => ({
    components: { AdresCrab },
    inheritAttrs: false,
    setup() {
      return { args };
    },
    template: `
      <Suspense>
        <AdresCrab v-bind="args" />
      </Suspense>
    `,
  }),
  argTypes: {
    config: {
      control: 'object',
    },
  },
};

export default meta;
type Story = StoryObj<typeof AdresCrab>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {};
