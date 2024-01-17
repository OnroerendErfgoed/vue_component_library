import '@/scss/main.scss';
import OeWizard from '../../components/dumb/OeWizard.vue';
import type { IStep } from '../../models/wizard';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta: Meta<typeof OeWizard> = {
  title: 'Dumb components/Wizard',
  component: OeWizard,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    steps: {
      description: 'Steps to show in the wizard.',
      table: {
        type: { summary: 'IStep[]' },
        defaultValue: { summary: '[]' },
      },
    },
    allowBarNavigation: {
      description: 'Allow wizard navigation by clicking on the steps in the wizard bar.',
      table: {
        type: { summary: 'boolean' },
      },
    },
    default: {
      description: 'Slot rendering the step content.',
      table: {
        type: {
          summary: 'Exposed props',
          detail: `
step: current step object
currentStep: current step index
totalSteps: number of steps
`,
        },
      },
    },
    submit: {
      description: 'Emits submit event when reaching final step and submitting.',
    },
  },
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
        { name: 'Gegevens EPC', validate: () => Promise.resolve({ valid: true }) },
        { name: 'Mijn gegevens', validate: () => Promise.resolve({ valid: true }) },
        { name: 'Bijlagen', validate: () => Promise.resolve({ valid: true }) },
        { name: 'Overzicht', validate: () => Promise.resolve({ valid: true }) },
      ];

      return { steps };
    },
    template: `
    <oe-wizard :steps="steps">
      <template #default="{ currentStep, totalSteps }">
        <h2>Stap {{ currentStep + 1 }} van {{ totalSteps }}</h2>
      </template>
    </oe-wizard>
    `,
  }),
};

export const BarNavigationAllowed: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Navigation by clicking on the wizard bar steps is also allowed.',
      },
    },
  },
  render: () => ({
    components: {
      OeWizard,
    },
    setup() {
      const steps: IStep[] = [
        { name: 'Gegevens EPC', validate: () => Promise.resolve({ valid: true }) },
        { name: 'Mijn gegevens', validate: () => Promise.resolve({ valid: true }) },
        { name: 'Bijlagen', validate: () => Promise.resolve({ valid: true }) },
        { name: 'Overzicht', validate: () => Promise.resolve({ valid: true }) },
      ];

      return { steps };
    },
    template: `
      <oe-wizard :steps="steps" allow-bar-navigation>
        <template #default="{ currentStep, totalSteps }">
          <h2>Stap {{ currentStep + 1 }} van {{ totalSteps }}</h2>
        </template>
      </oe-wizard>
      `,
  }),
};

export const BlockedWhenStepInvalid: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Step 3 is indicated as invalid, so step 4 cannot be reached both with bar navigation and navigation buttons.',
      },
    },
  },
  render: () => ({
    components: {
      OeWizard,
    },
    setup() {
      const steps: IStep[] = [
        { name: 'Gegevens EPC', validate: () => Promise.resolve({ valid: true }) },
        { name: 'Mijn gegevens', validate: () => Promise.resolve({ valid: true }) },
        {
          name: 'Bijlagen',
          validate: () =>
            Promise.resolve({
              valid: false,
              error: { id: '1', type: 'error', title: 'Er is een fout opgetreden.', content: 'Fout bij de bijlagen.' },
            }),
        },
        {
          name: 'Overzicht',
          validate: () =>
            Promise.resolve({
              valid: false,
              error: {
                id: '2',
                type: 'error',
                title: 'Er is een fout opgetreden.',
                content: 'Fout bij het overzicht.',
              },
            }),
        },
      ];

      return { steps };
    },
    template: `
      <oe-wizard :steps="steps" allow-bar-navigation>
        <template #default="{ currentStep, totalSteps }">
          <h2>Stap {{ currentStep + 1 }} van {{ totalSteps }}</h2>
        </template>
      </oe-wizard>
      `,
  }),
};

export const Mobile: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Consult the specific Mobile story to see the specified mobile viewport.',
      },
    },
    viewport: {
      //👇 The viewports you want to use
      viewports: INITIAL_VIEWPORTS,
      //👇 Your own default viewport
      defaultViewport: 'iphonex',
    },
  },
  render: () => ({
    components: {
      OeWizard,
    },
    setup() {
      const steps: IStep[] = [
        { name: 'Gegevens EPC', validate: () => Promise.resolve({ valid: true }) },
        { name: 'Mijn gegevens', validate: () => Promise.resolve({ valid: true }) },
        { name: 'Bijlagen', validate: () => Promise.resolve({ valid: true }) },
        { name: 'Overzicht', validate: () => Promise.resolve({ valid: true }) },
      ];

      return { steps };
    },
    template: `
    <oe-wizard :steps="steps">
      <template #default="{ currentStep, totalSteps }">
        <h2>Stap {{ currentStep + 1 }} van {{ totalSteps }}</h2>
      </template>
    </oe-wizard>
    `,
  }),
};

export const SubmitDisabledLastStepInvalid: Story = {
  render: () => ({
    components: {
      OeWizard,
    },
    setup() {
      const steps: IStep[] = [
        { name: 'Gegevens EPC', validate: () => Promise.resolve({ valid: true }) },
        { name: 'Mijn gegevens', validate: () => Promise.resolve({ valid: true }) },
        { name: 'Bijlagen', validate: () => Promise.resolve({ valid: true }) },
        {
          name: 'Overzicht',
          validate: () =>
            Promise.resolve({
              valid: false,
              error: {
                id: '2',
                type: 'error',
                title: 'Er is een fout opgetreden.',
                content: 'Fout bij het overzicht.',
              },
            }),
        },
      ];

      return { steps };
    },
    template: `
    <oe-wizard :steps="steps" disable-submit-when-invalid>
      <template #default="{ currentStep, totalSteps }">
        <h2>Stap {{ currentStep + 1 }} van {{ totalSteps }}</h2>
      </template>
    </oe-wizard>
    `,
  }),
};

export const DisableNextStepButton: Story = {
  render: () => ({
    components: {
      OeWizard,
    },
    setup() {
      const steps: IStep[] = [
        { name: 'Gegevens EPC', validate: () => Promise.resolve({ valid: true }) },
        { name: 'Mijn gegevens', validate: () => Promise.resolve({ valid: true }), nextStepDisabled: true },
        { name: 'Bijlagen', validate: () => Promise.resolve({ valid: true }) },
        {
          name: 'Overzicht',
          validate: () =>
            Promise.resolve({
              valid: false,
              error: {
                id: '2',
                type: 'error',
                title: 'Er is een fout opgetreden.',
                content: 'Fout bij het overzicht.',
              },
            }),
        },
      ];

      return { steps };
    },
    template: `
    <oe-wizard :steps="steps" disable-submit-when-invalid>
      <template #default="{ currentStep, totalSteps }">
        <h2>Stap {{ currentStep + 1 }} van {{ totalSteps }}</h2>
      </template>
    </oe-wizard>
    `,
  }),
};
