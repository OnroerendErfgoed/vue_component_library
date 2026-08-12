import OeClipboardCopy from '@components/core/dumb/OeClipboardCopy.vue';

describe('OeClipboardCopy', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      Object.defineProperty(win.navigator, 'clipboard', {
        configurable: true,
        value: { write: cy.stub().as('clipboardWrite').resolves() },
      });
    });
  });

  it('renders clipboard icon initially', () => {
    cy.mount({
      components: { OeClipboardCopy },
      template: `<OeClipboardCopy value="test-value" />`,
    });

    cy.get('.clipboard').should('exist');
    cy.get('.check').should('not.exist');
  });

  it('shows check icon after clicking clipboard icon', () => {
    cy.mount({
      components: { OeClipboardCopy },
      template: `<OeClipboardCopy value="test-value" />`,
    });

    cy.get('.clipboard').click();
    cy.get('.check').should('exist');
    cy.get('.clipboard').should('not.exist');
  });

  it('copies the value to clipboard on click', () => {
    cy.mount({
      components: { OeClipboardCopy },
      template: `<OeClipboardCopy value="test-value" />`,
    });

    cy.get('.clipboard').click();
    cy.get('@clipboardWrite').should('have.been.calledOnce');
  });

  it('reverts to clipboard icon after timeout', () => {
    cy.clock();

    cy.mount({
      components: { OeClipboardCopy },
      template: `<OeClipboardCopy value="test-value" />`,
    });

    cy.get('.clipboard').click();
    cy.get('.check').should('exist');
    cy.tick(1500);
    cy.get('.clipboard').should('exist');
    cy.get('.check').should('not.exist');
  });
});
