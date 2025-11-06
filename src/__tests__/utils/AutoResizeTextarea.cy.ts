import { mount } from 'cypress/vue';
import { vAutoResizeTextarea } from '@directives/auto-resize-textarea.directive';

describe('vAutoResizeTextarea Directive', () => {
  it('should resize the textarea when content is added', () => {
    mount({
      template: `<textarea v-auto-resize-textarea></textarea>`,
      directives: {
        autoResizeTextarea: vAutoResizeTextarea,
      },
    });

    // Select the textarea
    cy.get('textarea').as('textarea').should('have.css', 'resize', 'none'); // Ensure resize is disabled

    // Get the initial height
    cy.get('@textarea')
      .invoke('outerHeight')
      .then((initialHeight) => {
        // Type content into the textarea
        cy.get('@textarea')
          .type('This is a test.\nAdding more lines to test the resizing functionality.')
          .invoke('outerHeight')
          .should('be.greaterThan', initialHeight); // Ensure the height increases
      });
  });

  it('should shrink the textarea when content is removed', () => {
    mount({
      template: `<textarea v-auto-resize-textarea></textarea>`,
      directives: {
        autoResizeTextarea: vAutoResizeTextarea,
      },
    });

    // Select the textarea
    cy.get('textarea').as('textarea').type('This is a test.\nAdding more lines to test the resizing functionality.');

    // Get the height after adding content
    cy.get('@textarea')
      .invoke('outerHeight')
      .then((expandedHeight) => {
        // Clear the content
        cy.get('@textarea').clear().invoke('outerHeight').should('be.lessThan', expandedHeight); // Ensure the height decreases
      });
  });

  it('should adjust the height on mount if there is initial content', () => {
    mount({
      template: `<textarea v-auto-resize-textarea>Initial content for testing.</textarea>`,
      directives: {
        autoResizeTextarea: vAutoResizeTextarea,
      },
    });

    // Select the textarea
    cy.get('textarea')
      .as('textarea')
      .should('have.value', 'Initial content for testing.') // Ensure initial content is present
      .invoke('outerHeight')
      .should('be.greaterThan', 0); // Ensure the height is adjusted
  });
});
