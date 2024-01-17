import { defineComponent } from 'vue';
import NoRowsOverlay from '@/components/dumb/NoRowsOverlay.vue';

describe('NoRowsOverlay', () => {
  const TestComponent = defineComponent({
    components: { NoRowsOverlay },
    data: () => {
      return {
        params: {
          noRowsMessage: 'No rows available',
        },
      };
    },
    template: '<no-rows-overlay :params="params"/>',
  });

  beforeEach(() => {
    cy.mount(TestComponent);
  });

  it('has a wrapper with class ag-overlay-loading-center', () => {
    cy.dataCy('ag-overlay').should('have.class', 'ag-overlay-loading-center');
  });

  it('renders a warning icon', () => {
    cy.dataCy('warning-icon').should('exist').should('have.attr', 'data-icon', 'circle-exclamation');
  });

  it('renders the given no rows message', () => {
    cy.dataCy('ag-overlay').invoke('text').should('contain', 'No rows available');
  });
});
