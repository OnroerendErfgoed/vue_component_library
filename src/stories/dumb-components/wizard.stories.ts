import type { Meta, StoryObj } from '@storybook/vue3';
import type { IStep } from '../../models/wizard';
import OeWizard from '../../components/dumb/OeWizard.vue';

import '@/scss/main.scss';
const meta: Meta<typeof OeWizard> = {
  title: 'Dumb components/Wizard',
  component: OeWizard,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof OeWizard>;

export const Default: Story = {
  render: () => ({
    components: {
      OeWizard,
    },
    setup() {
      const steps: IStep[] = [
        { name: 'Gegevens EPC' },
        { name: 'Mijn gegevens' },
        { name: 'Bijlagen' },
        { name: 'Overzicht' },
      ];

      return { steps };
    },
    template: `
    <oe-wizard :steps="steps">
      <template #default="{ step, currentStep, totalSteps }">
        <h2>Stap {{ currentStep + 1 }} van {{ totalSteps }} - {{ step.name }}</h2>
      </template>
    </oe-wizard>
    `,
  }),
};
