import { mount } from 'cypress/vue';
import { defineComponent, useAttrs } from 'vue';
import OeInventarisLoadedLink from '@components/core/dumb/OeInventarisLoadedLink.vue';

const TestComponent = defineComponent({
  components: { OeInventarisLoadedLink },
  setup() {
    const attrs = useAttrs();
    return { attrs };
  },
  template: '<OeInventarisLoadedLink v-bind="attrs"></OeInventarisLoadedLink>',
});

describe('OeInventarisLoadedLink - no data', () => {
  it('renders', () => {
    mount(TestComponent, { props: { gebeurtenissen: undefined, waarnemingen: undefined } });
  });

  it('shows the correct no data shown text', () => {
    mount(TestComponent, { props: { gebeurtenissen: undefined, waarnemingen: undefined } });
    cy.dataCy('geen-gekoppelde-waarnemingen').should('have.text', 'Geen gekoppelde waarnemingen beschikbaar.');
    cy.dataCy('geen-gekoppelde-gebeurtenissen').should('have.text', 'Geen gekoppelde gebeurtenissen beschikbaar.');
  });

  it('shows the gebeurtenissen and waarnemingen', () => {
    const gebeurtenissen = [
      {
        id: 1,
        titel: 'Toevalsvondst Kardinaal Mercierlaan 66, Leuven',
        uri: 'https://dev-id.erfgoed.net/gebeurtenissen/1',
      },
      {
        id: 2,
        titel: 'Toevalsvondst Kardinaal Mercierlaan 67, Leuven',
        uri: 'https://dev-id.erfgoed.net/gebeurtenissen/2',
      },
    ];
    const waarnemingen = [
      { id: 1, naam: 'Kardinaal Mercierlaan 66, Leuven', uri: 'https://dev-id.erfgoed.net/waarnemingen/1' },
      { id: 2, naam: 'Kardinaal Mercierlaan 67, Leuven', uri: 'https://dev-id.erfgoed.net/waarnemingen/2' },
    ];
    mount(TestComponent, { props: { gebeurtenissen: gebeurtenissen, waarnemingen: waarnemingen } });

    cy.dataCy('gekoppelde-waarnemingen-title').should('have.text', 'Gekoppelde waarnemingen');
    cy.dataCy('gekoppelde-gebeurtenissen-title').should('have.text', 'Gekoppelde gebeurtenissen');
    cy.dataCy('waarneming-link-1').should('have.text', 'Kardinaal Mercierlaan 66, Leuven (1)');
    cy.dataCy('gebeurtenis-link-1').should('have.text', 'Toevalsvondst Kardinaal Mercierlaan 66, Leuven (1)');
    cy.dataCy('waarneming-link-2').should('have.text', 'Kardinaal Mercierlaan 67, Leuven (2)');
    cy.dataCy('gebeurtenis-link-2').should('have.text', 'Toevalsvondst Kardinaal Mercierlaan 67, Leuven (2)');
  });
});
