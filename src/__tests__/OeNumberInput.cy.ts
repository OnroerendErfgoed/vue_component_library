/* eslint-disable vue/one-component-per-file */
import { defineComponent, ref } from 'vue';
import OeNumberInput from '@components/forms/dumb/OeNumberInput.vue';

const mountNumberInput = (initialValue: number | null = null) => {
  const TestComponent = defineComponent({
    components: { OeNumberInput },
    setup() {
      const value = ref<number | null>(initialValue);
      return { value };
    },
    template: '<oe-number-input v-model="value" data-cy="number-input" />',
  });

  return cy.mount(TestComponent);
};

describe('OeNumberInput', () => {
  it('renders an empty input when modelValue is null', () => {
    mountNumberInput();
    // VlInputField renders an input field inside the component
    cy.get('[data-cy="number-input"]').should('have.value', '');
  });

  it('correctly handles fallthrough attributes', () => {
    const TestComponent = defineComponent({
      components: { OeNumberInput },
      setup() {
        const value = ref<number | null>(null);
        return { value };
      },
      template: `<oe-number-input v-model="value" placeholder="Placeholder" data-cy="number-input" />`,
    });

    cy.mount(TestComponent);
    cy.get('[data-cy="number-input"]').should('have.attr', 'placeholder', 'Placeholder');
  });

  it('renders a formatted number when modelValue is provided', () => {
    mountNumberInput(1234.56);
    cy.get('[data-cy="number-input"]').should('have.value', '1234,56');
  });

  it('emits update and updates v-model when user enters a valid number', () => {
    mountNumberInput().then(({ component }) => {
      const testCases = [
        { input: '-123', expected: -123 },
        { input: '-123,45', expected: -123.45 },
        { input: '0', expected: 0 },
        { input: '123', expected: 123 },
        { input: '123,45', expected: 123.45 },
        { input: '123.45', expected: 12345 },
        { input: '1.000.000', expected: 1000000 },
        { input: '1 000 000', expected: 1000000 },
        { input: '1.000,11', expected: 1000.11 },
      ];

      testCases.forEach(({ input, expected }) => {
        cy.get('[data-cy="number-input"]').clear().type(input).blur();
        cy.wait(10).then(() => {
          expect(component.value).to.equal(expected);
        });
      });
    });
  });

  it('clears the value when input is cleared', () => {
    mountNumberInput(987).then(({ component }) => {
      cy.get('[data-cy="number-input"]').should('have.value', '987');
      cy.get('[data-cy="number-input"]').clear().blur();
      cy.wait(10).then(() => {
        expect(component.value).to.equal(null);
      });
    });
  });

  it('prevents typing of a second comma', () => {
    mountNumberInput();
    // Type an initial comma and then attempt a second one
    cy.get('[data-cy="number-input"]')
      .clear()
      .type('12,34')
      .should('have.value', '12,34')
      .type(',')
      .should('have.value', '12,34'); // The second comma should be prevented
  });

  it('prevents typing of letters, dots, and special characters', () => {
    mountNumberInput();
    cy.get('[data-cy="number-input"]')
      .clear()
      .type('abc.!@#$%^&*()')
      .should('have.value', '')
      .clear()
      .type('100 euro')
      .should('have.value', '100')
      .clear()
      .type('€ 100')
      .should('have.value', '100');
  });

  it('allows typing of a minus sign for negative numbers', () => {
    mountNumberInput();
    cy.get('[data-cy="number-input"]').clear().type('-123,45').should('have.value', '-123,45');
  });

  it('prevents typing of multiple minus signs', () => {
    mountNumberInput();
    // Type an initial minus sign and then attempt a second one
    cy.get('[data-cy="number-input"]')
      .clear()
      .type('-123,45')
      .should('have.value', '-123,45')
      .type('-')
      .should('have.value', '-123,45'); // The second minus sign should be prevented
  });

  it('removes leading zeros', () => {
    mountNumberInput();
    cy.get('[data-cy="number-input"]').clear().type('000123,45').should('have.value', '123,45');
  });
});
