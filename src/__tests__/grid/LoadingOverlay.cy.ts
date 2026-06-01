import { defineComponent } from 'vue';
import { OeLoadingOverlay } from '@components/grid';

describe('LoadingOverlay', () => {
  const TestComponent = defineComponent({
    components: { OeLoadingOverlay },
    data: () => {
      return {
        params: {
          loadingMessage: 'Loading...',
        },
      };
    },
    template: '<oe-loading-overlay :params="params"/>',
  });

  beforeEach(() => {
    cy.mount(TestComponent);
  });

  it('has a wrapper with class ag-overlay-loading-center', () => {
    cy.dataCy('ag-overlay').should('have.class', 'ag-overlay-loading-center');
  });

  it('renders a spinner icon', () => {
    cy.dataCy('spinner-icon').should('exist').should('have.attr', 'data-icon', 'spinner');
  });

  it('renders the given loading message', () => {
    cy.dataCy('ag-overlay').invoke('text').should('contain', 'Loading...');
  });
});
