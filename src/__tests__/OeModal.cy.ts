import { VlActionGroup, VlButton, VlModalToggle, VlTitle } from '@govflanders/vl-ui-design-system-vue3';
import { ref } from 'vue';
import OeModal from '@/components/dumb/OeModal.vue';

describe('OeModal', () => {
  describe('Props', () => {
    it('accepts and applies id prop', () => {
      const testId = 'test-modal-id';
      cy.mount({
        components: { OeModal },
        setup() {
          const open = ref(true);
          return { open };
        },
        template: `
        <OeModal v-model:open="open" :id="'${testId}'" title="Test Modal Title">
          <p>Test content</p>
        </OeModal>
      `,
      });

      cy.get('.oe-modal-wrapper').should('be.visible');
      cy.get('.vl-modal-dialog').should('have.attr', 'aria-labelledby', `${testId}-label`);
      cy.get('.vl-modal-dialog').should('have.attr', 'aria-describedby', `${testId}-description`);
    });

    // it('applies modLocked prop correctly', () => {
    //   cy.mount({
    //     components: { OeModal },
    //     setup() {
    //       const open = ref(true);
    //       return { open };
    //     },
    //     template: `
    //     <OeModal v-model:open="open" title="Locked Modal" :mod-locked="true">
    //       <p>Locked modal content</p>
    //     </OeModal>
    //   `,
    //   });

    //   cy.get('.oe-modal-wrapper').should('be.visible');
    //   cy.get('.vl-modal-dialog').should('have.class', 'vl-modal-dialog--locked');
    // });
  });

  describe('Rendering and basic functionality', () => {
    it('renders and opens with default slot content', () => {
      cy.mount({
        components: { OeModal, VlButton },
        setup() {
          const open = ref(true);
          return { open };
        },
        template: `
        <OeModal v-model:open="open" title="Default Modal Title">
          <p data-cy="modal-content">Default modal content</p>
        </OeModal>
      `,
      });

      cy.get('.oe-modal-wrapper').should('be.visible');
      cy.get('.vl-title').should('contain.text', 'Default Modal Title');
      cy.get('.vl-modal-dialog__content').should('contain.text', 'Default modal content');
    });

    it('renders custom header, content, and footer slots', () => {
      cy.mount({
        components: { OeModal, VlTitle, VlActionGroup, VlButton },
        setup() {
          const open = ref(true);
          const closeModal = () => {
            open.value = false;
          };
          return { open, closeModal };
        },
        template: `
        <OeModal v-model:open="open">
          <template #modal-header>
            <VlTitle tag-name="h2" data-cy="modal-header">Custom Modal Title</VlTitle>
          </template>
          <template #modal-content>
            <div data-cy="modal-content">Custom slot content</div>
          </template>
          <template #modal-footer>
            <VlActionGroup mod-align-center>
              <VlButton data-cy="close-btn" @click="closeModal">Close</VlButton>
            </VlActionGroup>
          </template>
        </OeModal>
      `,
      });

      cy.get('.vl-modal-dialog__header').should('contain.text', 'Custom Modal Title');
      cy.get('.vl-modal-dialog__content').should('contain.text', 'Custom slot content');
      cy.get('.vl-modal-dialog__footer').find('button').should('contain.text', 'Close');
    });

    it('renders with a title and close button when closable', () => {
      cy.mount({
        components: { OeModal },
        setup() {
          const open = ref(true);
          return { open };
        },
        template: `
        <OeModal v-model:open="open" title="Test Title" closable>
          <p>Test content</p>
        </OeModal>
      `,
      });

      cy.get('.oe-modal-wrapper').should('be.visible');
      cy.contains('Test Title').should('exist');
      cy.get('.vl-modal-dialog__close').should('exist');
    });

    it('does not render close button when closable is false', () => {
      cy.mount({
        components: { OeModal },
        setup() {
          const open = ref(true);
          return { open };
        },
        template: `
        <OeModal v-model:open="open" title="Test Title" :closable="false">
          <p>Test content</p>
        </OeModal>
      `,
      });

      cy.get('.oe-modal-wrapper').should('be.visible');
      cy.get('.vl-modal-dialog__close').should('not.exist');
    });
  });

  describe('Interactivity', () => {
    it('can be opened and closed using v-model', () => {
      cy.mount({
        components: { OeModal, VlButton, VlActionGroup },
        setup() {
          const open = ref(false);
          const openModal = () => {
            open.value = true;
          };
          const closeModal = () => {
            open.value = false;
          };
          return { open, openModal, closeModal };
        },
        template: `
        <VlButton data-cy="open-btn" @click="openModal">Open Modal</VlButton>
        <OeModal v-model:open="open" title="Closable Modal Title">
          <p data-cy="modal-content">Closable modal content</p>
          <template #modal-footer>
            <VlActionGroup mod-align-center>
              <VlButton data-cy="close-btn" @click="closeModal">Close</VlButton>
            </VlActionGroup>
          </template>
        </OeModal>
      `,
      });

      cy.get('.oe-modal-wrapper').should('not.be.visible');

      // Open the modal
      cy.dataCy('open-btn').click();
      cy.get('.oe-modal-wrapper').should('be.visible');
      cy.get('.vl-title').should('contain.text', 'Closable Modal Title');
      cy.get('.vl-modal-dialog__content').should('contain.text', 'Closable modal content');

      // Close the modal
      cy.dataCy('close-btn').click();
      cy.get('.oe-modal-wrapper').should('not.be.visible');
    });

    it('does not close when clicking backdrop if modDisableBackdropClose is true', () => {
      cy.mount({
        components: { OeModal, VlButton },
        setup() {
          const open = ref(true);
          return { open };
        },
        template: `
        <OeModal v-model:open="open" modDisableBackdropClose>
          <p data-cy="modal-content">Backdrop close disabled</p>
        </OeModal>
      `,
      });

      cy.get('.oe-modal-wrapper').should('be.visible');
      cy.get('.oe-modal-backdrop').click({ force: true });
      cy.get('.oe-modal-wrapper').should('be.visible');
    });

    it('closes when clicking backdrop if modDisableBackdropClose is false', () => {
      cy.mount({
        components: { OeModal, VlButton },
        setup() {
          const open = ref(true);
          return { open };
        },
        template: `
        <OeModal v-model:open="open">
          <p data-cy="modal-content">Backdrop close enabled</p>
        </OeModal>
      `,
      });

      cy.get('.oe-modal-wrapper').should('be.visible');
      cy.get('.vl-modal-backdrop').click({ force: true });
      cy.get('.oe-modal-wrapper').should('not.be.visible');
    });

    it('supports toggling via custom directive', () => {
      cy.mount({
        directives: { VlModalToggle },
        components: { OeModal, VlButton, VlActionGroup },
        setup() {
          const open = ref(false);
          const toggleModal = () => {
            open.value = !open.value;
          };
          return { open, toggleModal };
        },
        template: `
        <VlButton data-cy="toggle-btn" @click="toggleModal">Toggle Modal</VlButton>
        <OeModal id="custom-modal" v-model:open="open" title="Toggle Modal Title">
          <p data-cy="modal-content">Toggled modal content</p>
          <template #modal-footer>
            <VlActionGroup mod-align-center>
              <VlButton data-cy="toggle-close-btn" @click="toggleModal">Close</VlButton>
            </VlActionGroup>
          </template>
        </OeModal>
      `,
      });

      cy.get('.oe-modal-wrapper').should('not.be.visible');
      cy.dataCy('toggle-btn').click();
      cy.get('.oe-modal-wrapper').should('be.visible');
      cy.dataCy('toggle-close-btn').click();
      cy.get('.oe-modal-wrapper').should('not.be.visible');
    });
  });
});
