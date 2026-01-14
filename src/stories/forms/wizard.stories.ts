import { VlButton } from '@govflanders/vl-ui-design-system-vue3';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import OeWizard from '@components/forms/dumb/OeWizard.vue';
import { IStep } from '@components/forms/models/wizard';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta: Meta<typeof OeWizard> = {
  title: 'Forms Module/Wizard',
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

export const CustomButtons: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The wizard provides named slots (`actions-before`, `previous-button-content`, `next-button-content`, `submit-button-content`, `actions-after`,) to customize the button labels, icons and extra actions while keeping the default navigation logic.',
      },
    },
  },
  render: () => ({
    components: {
      OeWizard,
      VlButton,
    },
    setup() {
      const steps: IStep[] = [
        { name: 'Gegevens EPC', validate: () => Promise.resolve({ valid: true }) },
        { name: 'Mijn gegevens', validate: () => Promise.resolve({ valid: true }) },
        { name: 'Bijlagen', validate: () => Promise.resolve({ valid: true }) },
        { name: 'Overzicht', validate: () => Promise.resolve({ valid: true }) },
      ];

      const handleSubmit = () => {
        alert('Wizard submitted!');
      };

      return { steps, handleSubmit };
    },
    template: `
    <OeWizard :steps="steps" @submit="handleSubmit">
      <template #actions-before>
        <VlButton class="vl-u-spacer-right--xsmall">ButtonBefore</VlButton>
      </template>

      <template #previous-button-content>
        Terug
      </template>

      <template #next-button-content>
        Verder
      </template>

      <template #submit-button-content>
        Voltooien
      </template>

      <template #actions-after>
        <VlButton class="vl-u-spacer-left--xsmall">ButtonAfter</VlButton>
      </template>
    </OeWizard>
    `,
  }),
};
