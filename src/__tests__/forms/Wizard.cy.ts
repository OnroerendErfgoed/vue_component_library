/* eslint-disable vue/one-component-per-file */
import { defineComponent } from 'vue';
import OeWizard from '@components/forms/dumb/OeWizard.vue';
import type { IStep } from '@components/forms/models/wizard';

describe('OeWizard', () => {
  describe('default', () => {
    const TestComponent = defineComponent({
      components: { OeWizard },
      setup() {
        const steps: IStep[] = [
          { name: 'Algemene gegevens', validate: () => Promise.resolve({ valid: true }) },
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
    });

    beforeEach(() => {
      cy.viewport('macbook-16');
    });

    it('renders a step for each given step', () => {
      cy.mount(TestComponent).then(({ component }) => {
        cy.dataCy('wizard-bar')
          .children()
          .should('have.length', 4)
          .each((step, index) => {
            expect(step.text()).to.equal(`${index + 1}${component.steps[index].name}`);
          });
      });
    });

    it('does nothing when clicking on a step', () => {
      cy.mount(TestComponent);

      cy.dataCy('step-2').click();
      cy.get('.wizard__bar-item--current').invoke('text').should('equal', '1Algemene gegevens');
    });

    describe('navigation', () => {
      beforeEach(() => {
        cy.mount(TestComponent);
      });

      it('does not have a previous button in step 1', () => {
        cy.dataCy('previous-step-button').should('not.exist');
      });

      it('has a next button in step 1', () => {
        cy.dataCy('next-step-button').should('exist');
      });

      it('can handle navigation back and forth', () => {
        // Go to step 2
        cy.dataCy('next-step-button').click();
        cy.get('.wizard__bar-item--current').invoke('text').should('equal', '2Mijn gegevens');

        cy.dataCy('previous-step-button').should('exist');
        cy.dataCy('next-step-button').should('exist');

        // Go to step 3
        cy.dataCy('next-step-button').click();
        cy.get('.wizard__bar-item--current').invoke('text').should('equal', '3Bijlagen');

        cy.dataCy('previous-step-button').should('exist');
        cy.dataCy('next-step-button').should('exist');

        // Go to step 4
        cy.dataCy('next-step-button').click();
        cy.get('.wizard__bar-item--current').invoke('text').should('equal', '4Overzicht');

        cy.dataCy('previous-step-button').should('exist');
        cy.dataCy('next-step-button').should('not.exist');

        // Go to step 3
        cy.dataCy('previous-step-button').click();
        cy.get('.wizard__bar-item--current').invoke('text').should('equal', '3Bijlagen');

        cy.dataCy('previous-step-button').should('exist');
        cy.dataCy('next-step-button').should('exist');

        // Go to step 2
        cy.dataCy('previous-step-button').click();
        cy.get('.wizard__bar-item--current').invoke('text').should('equal', '2Mijn gegevens');

        cy.dataCy('previous-step-button').should('exist');
        cy.dataCy('next-step-button').should('exist');

        // Go to step 1
        cy.dataCy('previous-step-button').click();
        cy.get('.wizard__bar-item--current').invoke('text').should('equal', '1Algemene gegevens');

        cy.dataCy('previous-step-button').should('not.exist');
        cy.dataCy('next-step-button').should('exist');
      });

      it('does not have a next button in the latest step', () => {
        cy.dataCy('next-step-button').click();
        cy.dataCy('next-step-button').click();
        cy.dataCy('next-step-button').click();

        cy.get('.wizard__bar-item--current').invoke('text').should('equal', '4Overzicht');

        cy.dataCy('previous-step-button').should('exist');
        cy.dataCy('next-step-button').should('not.exist');
      });

      it('submits the wizard when clicking on submit in the latest step', () => {
        const onSubmitSpy = cy.spy().as('onSubmitSpy');

        cy.mount(TestComponent, { props: { onSubmit: onSubmitSpy } }).then(() => {
          cy.dataCy('next-step-button').click();
          cy.dataCy('next-step-button').click();
          cy.dataCy('next-step-button').click();

          cy.get('.wizard__bar-item--current').invoke('text').should('equal', '4Overzicht');

          cy.dataCy('submit-button').should('exist').click();

          cy.get('@onSubmitSpy').should('have.been.called');
        });
      });

      it('renders the activated step in the default slot', () => {
        cy.dataCy('step-1-content').invoke('text').should('equal', 'Stap 1 van 4');
        cy.dataCy('next-step-button').click();

        cy.dataCy('step-2-content').invoke('text').should('equal', 'Stap 2 van 4');
        cy.dataCy('next-step-button').click();

        cy.dataCy('step-3-content').invoke('text').should('equal', 'Stap 3 van 4');
        cy.dataCy('next-step-button').click();

        cy.dataCy('step-4-content').invoke('text').should('equal', 'Stap 4 van 4');
      });
    });
  });

  describe('last step invalid', () => {
    const TestComponent = defineComponent({
      components: { OeWizard },
      setup() {
        const steps: IStep[] = [
          { name: 'Algemene gegevens', validate: () => Promise.resolve({ valid: true }) },
          { name: 'Mijn gegevens', validate: () => Promise.resolve({ valid: true }) },
          { name: 'Bijlagen', validate: () => Promise.resolve({ valid: true }) },
          { name: 'Overzicht', validate: () => Promise.resolve({ valid: false }) },
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
    });

    beforeEach(() => {
      cy.viewport('macbook-16');
    });

    it('does not submit the wizard when clicking on submit in the latest step when the step is invalid', () => {
      const onSubmitSpy = cy.spy().as('onSubmitSpy');

      cy.mount(TestComponent, { props: { onSubmit: onSubmitSpy } }).then(() => {
        cy.dataCy('next-step-button').click();
        cy.dataCy('next-step-button').click();
        cy.dataCy('next-step-button').click();

        cy.get('.wizard__bar-item--current').invoke('text').should('equal', '4Overzicht');

        cy.dataCy('submit-button').should('exist').click();

        cy.get('@onSubmitSpy').should('not.have.been.called');
      });
    });
  });

  describe('bar navigation allowed', () => {
    const TestComponent = defineComponent({
      components: { OeWizard },
      setup() {
        const steps: IStep[] = [
          { name: 'Algemene gegevens', validate: () => Promise.resolve({ valid: true }) },
          { name: 'Mijn gegevens', validate: () => Promise.resolve({ valid: true }) },
          { name: 'Bijlagen', validate: () => Promise.resolve({ valid: true }) },
          { name: 'Overzicht', validate: () => Promise.resolve({ valid: true }) },
        ];

        return { steps };
      },
      template: `<oe-wizard :steps="steps" allow-bar-navigation></oe-wizard>`,
    });

    beforeEach(() => {
      cy.mount(TestComponent);
    });

    it('navigates when clicking on a step in the wizardbar', () => {
      cy.dataCy('step-2').click();
      cy.get('.wizard__bar-item--current').invoke('text').should('equal', '2Mijn gegevens');
    });
  });

  describe('blocked invalid step', () => {
    const TestComponent = defineComponent({
      components: { OeWizard },
      setup() {
        const steps: IStep[] = [
          { name: 'Algemene gegevens', validate: () => Promise.resolve({ valid: true }) },
          { name: 'Mijn gegevens', validate: () => Promise.resolve({ valid: false }) },
          { name: 'Bijlagen', validate: () => Promise.resolve({ valid: true }) },
          { name: 'Overzicht', validate: () => Promise.resolve({ valid: true }) },
        ];

        return { steps };
      },
      template: `<oe-wizard :steps="steps" allow-bar-navigation></oe-wizard>`,
    });

    beforeEach(() => {
      cy.mount(TestComponent);
    });

    it('does not navigate to a step when previous step is invalid using bar navigation', () => {
      cy.dataCy('step-3').click();
      cy.get('.wizard__bar-item--current').invoke('text').should('equal', '1Algemene gegevens');

      cy.dataCy('step-4').click();
      cy.get('.wizard__bar-item--current').invoke('text').should('equal', '1Algemene gegevens');

      cy.dataCy('step-2').click();
      cy.get('.wizard__bar-item--current').invoke('text').should('equal', '2Mijn gegevens');
    });

    it('does not navigate to the next step when current step is invalid using next step buttons', () => {
      cy.dataCy('next-step-button').click();
      cy.get('.wizard__bar-item--current').invoke('text').should('equal', '2Mijn gegevens');
      cy.dataCy('next-step-button').click();
      cy.get('.wizard__bar-item--current').invoke('text').should('equal', '2Mijn gegevens');
    });
  });

  describe('mobile view', () => {
    const TestComponent = defineComponent({
      components: { OeWizard },
      setup() {
        const steps: IStep[] = [
          { name: 'Algemene gegevens', validate: () => Promise.resolve({ valid: true }) },
          {
            name: 'Mijn gegevens',
            validate: () =>
              Promise.resolve({
                valid: false,
                error: { id: '1', title: 'Error titel', content: 'Er heeft zich een error voorgedaan', type: 'error' },
              }),
          },
          { name: 'Bijlagen', validate: () => Promise.resolve({ valid: true }) },
          { name: 'Overzicht', validate: () => Promise.resolve({ valid: true }) },
        ];

        return { steps };
      },
      template: `<oe-wizard :steps="steps" allow-bar-navigation></oe-wizard>`,
    });

    beforeEach(() => {
      cy.viewport('iphone-6');
      cy.mount(TestComponent);
    });

    it('does not render the step name in the wizardbar', () => {
      cy.dataCy('wizard-bar').find('.wizard__bar-item-name').first().should('not.be.visible');
    });
  });

  describe('disable submit', () => {
    const TestComponent = defineComponent({
      components: { OeWizard },
      props: {
        lastStepValid: {
          type: Boolean,
          required: true,
        },
      },
      setup(props) {
        const steps: IStep[] = [
          { name: 'Algemene gegevens', validate: () => Promise.resolve({ valid: true }) },
          { name: 'Mijn gegevens', validate: () => Promise.resolve({ valid: true }) },
          { name: 'Bijlagen', validate: () => Promise.resolve({ valid: true }) },
          { name: 'Overzicht', validate: () => Promise.resolve({ valid: props.lastStepValid }) },
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
    });

    beforeEach(() => {
      cy.viewport('macbook-16');
    });

    it('disables the submit button when last step is invalid', () => {
      cy.mount(TestComponent, { props: { lastStepValid: false } });

      cy.dataCy('next-step-button').click();
      cy.dataCy('next-step-button').click();
      cy.dataCy('next-step-button').click();

      cy.dataCy('submit-button').should('be.disabled');
    });

    it('does not disable the submit button when last step is valid', () => {
      cy.mount(TestComponent, { props: { lastStepValid: true } });
      cy.dataCy('next-step-button').click();
      cy.dataCy('next-step-button').click();
      cy.dataCy('next-step-button').click();

      cy.dataCy('submit-button').should('not.be.disabled');
    });
  });

  describe('disable next step', () => {
    const TestComponent = defineComponent({
      components: { OeWizard },
      setup() {
        const steps: IStep[] = [
          { name: 'Algemene gegevens', validate: () => Promise.resolve({ valid: true }) },
          { name: 'Mijn gegevens', validate: () => Promise.resolve({ valid: true }), nextStepDisabled: true },
          { name: 'Bijlagen', validate: () => Promise.resolve({ valid: true }) },
          { name: 'Overzicht', validate: () => Promise.resolve({ valid: true }) },
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
    });

    beforeEach(() => {
      cy.viewport('macbook-16');
    });

    it('disables the next step button when nextStepDisabled is true', () => {
      cy.mount(TestComponent);
      cy.dataCy('next-step-button').click();
      cy.dataCy('next-step-button').should('be.disabled');
    });
  });

  describe('slots: button content', () => {
    const TestComponent = defineComponent({
      components: { OeWizard },
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
      <OeWizard :steps="steps">
        <template #actions-before>
          <button data-cy="actions-before-button">
            ButtonBefore
          </button>
        </template>
        <template #previous-button-content>
          <span data-cy="custom-previous">Terug</span>
        </template>
        <template #next-button-content>
          <span data-cy="custom-next">Verder</span>
        </template>
        <template #submit-button-content>
          <span data-cy="custom-submit">Voltooien</span>
        </template>
        <template #actions-after>
          <button data-cy="actions-after-button">
            ButtonAfter
          </button>
        </template>
      </OeWizard>
    `,
    });

    it('renders custom slot content for previous, next, and submit buttons', () => {
      cy.mount(TestComponent);

      // Step 1: only next button visible
      cy.dataCy('next-step-button').find('[data-cy="custom-next"]').should('contain.text', 'Verder');
      cy.dataCy('previous-step-button').should('not.exist');
      cy.dataCy('submit-button').should('not.exist');

      // Step 2: previous and next buttons visible
      cy.dataCy('next-step-button').click();
      cy.dataCy('previous-step-button').find('[data-cy="custom-previous"]').should('contain.text', 'Terug');
      cy.dataCy('next-step-button').find('[data-cy="custom-next"]').should('contain.text', 'Verder');
      cy.dataCy('submit-button').should('not.exist');

      // Step 3: previous and next buttons visible
      cy.dataCy('next-step-button').click();
      cy.dataCy('previous-step-button').find('[data-cy="custom-previous"]').should('contain.text', 'Terug');
      cy.dataCy('next-step-button').find('[data-cy="custom-next"]').should('contain.text', 'Verder');
      cy.dataCy('submit-button').should('not.exist');

      // Step 4: previous and submit buttons visible
      cy.dataCy('next-step-button').click();
      cy.dataCy('previous-step-button').find('[data-cy="custom-previous"]').should('contain.text', 'Terug');
      cy.dataCy('submit-button').find('[data-cy="custom-submit"]').should('contain.text', 'Voltooien');
      cy.dataCy('next-step-button').should('not.exist');
    });

    it('renders custom slot content for before and after action content', () => {
      cy.mount(TestComponent);

      cy.dataCy('actions-before-button').should('exist').and('contain.text', 'ButtonBefore');
      cy.dataCy('actions-after-button').should('exist').and('contain.text', 'ButtonAfter');
    });
  });
});
