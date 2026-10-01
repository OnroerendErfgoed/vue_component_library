import { ref } from 'vue';
import OeModalConfirm from '@components/core/dumb/OeModalConfirm.vue';

describe('OeModalConfirm', () => {
  it('renders slot content and default action labels', () => {
    cy.mount({
      components: { OeModalConfirm },
      setup() {
        const open = ref(true);
        return { open };
      },
      template: `
        <OeModalConfirm v-model:open="open" title="Melding verwijderen">
          <p data-cy="modal-content">Ben je zeker dat je deze melding wilt verwijderen?</p>
        </OeModalConfirm>
      `,
    });

    cy.get('.vl-title').should('contain.text', 'Melding verwijderen');
    cy.dataCy('modal-content').should('be.visible');
    cy.dataCy('confirm-button').should('contain.text', 'OK');
    cy.dataCy('cancel-button').should('contain.text', 'Annuleren');
  });

  it('emits confirm and cancel events with custom labels', () => {
    cy.mount({
      components: { OeModalConfirm },
      setup() {
        const open = ref(true);
        const confirm = cy.stub().as('confirm');
        const cancel = cy.stub().as('cancel');
        return { open, confirm, cancel };
      },
      template: `
        <OeModalConfirm
          v-model:open="open"
          title="Melding verwijderen"
          confirm-label="Verwijderen"
          cancel-label="Behouden"
          @confirm="confirm"
          @cancel="cancel"
        >
          Weet je dit zeker?
        </OeModalConfirm>
      `,
    });

    cy.dataCy('confirm-button').should('contain.text', 'Verwijderen').click();
    cy.get('@confirm').should('have.been.calledOnce');
    cy.dataCy('cancel-button').should('contain.text', 'Behouden').click();
    cy.get('@cancel').should('have.been.calledOnce');
  });
});
