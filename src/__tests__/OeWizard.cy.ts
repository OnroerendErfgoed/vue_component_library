/* eslint-disable vue/one-component-per-file */
import { OeWizard } from '@components/dumb';
import type { IStep } from '@models/wizard';
import { defineComponent } from 'vue';

describe('OeWizard', () => {
  describe('default', () => {
    const TestComponent = defineComponent({
      components: { OeWizard },
      setup() {
        const steps: IStep[] = [
          { name: 'Algemene gegevens', validate: () => Promise.resolve(true) },
          { name: 'Mijn gegevens', validate: () => Promise.resolve(true) },
          { name: 'Bijlagen', validate: () => Promise.resolve(true) },
          { name: 'Overzicht', validate: () => Promise.resolve(true) },
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

  describe('bar navigation allowed', () => {
    const TestComponent = defineComponent({
      components: { OeWizard },
      setup() {
        const steps: IStep[] = [
          { name: 'Algemene gegevens', validate: () => Promise.resolve(true) },
          { name: 'Mijn gegevens', validate: () => Promise.resolve(true) },
          { name: 'Bijlagen', validate: () => Promise.resolve(true) },
          { name: 'Overzicht', validate: () => Promise.resolve(true) },
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
          { name: 'Algemene gegevens', validate: () => Promise.resolve(true) },
          { name: 'Mijn gegevens', validate: () => Promise.resolve(false) },
          { name: 'Bijlagen', validate: () => Promise.resolve(true) },
          { name: 'Overzicht', validate: () => Promise.resolve(true) },
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
  });

  describe('mobile view', () => {
    const TestComponent = defineComponent({
      components: { OeWizard },
      setup() {
        const steps: IStep[] = [
          { name: 'Algemene gegevens', validate: () => Promise.resolve(true) },
          { name: 'Mijn gegevens', validate: () => Promise.resolve(false) },
          { name: 'Bijlagen', validate: () => Promise.resolve(true) },
          { name: 'Overzicht', validate: () => Promise.resolve(true) },
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
      props: ['lastStepValid'],
      setup(props) {
        const steps: IStep[] = [
          { name: 'Algemene gegevens', validate: () => Promise.resolve(true) },
          { name: 'Mijn gegevens', validate: () => Promise.resolve(true) },
          { name: 'Bijlagen', validate: () => Promise.resolve(true) },
          { name: 'Overzicht', validate: () => Promise.resolve(props.lastStepValid) },
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
          { name: 'Algemene gegevens', validate: () => Promise.resolve(true) },
          { name: 'Mijn gegevens', validate: () => Promise.resolve(true), nextStepDisabled: true },
          { name: 'Bijlagen', validate: () => Promise.resolve(true) },
          { name: 'Overzicht', validate: () => Promise.resolve(true) },
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
});
