import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { mount } from 'cypress/vue';
import { defineComponent, useAttrs } from 'vue';
import OeInventarisLink from '@components/smart/OeInventarisLink.vue';
import type { IInventarisLinkGebeurtenis, IInventarisLinkWaarneming, ILinks } from '@models/links';

const WAARNEMING_API =
  'https://dev-inventaris.onroerenderfgoed.be/gebeurtenissen?bron_referentie_uri=https://dev-id.erfgoed.net/dossiers/158226';
const GEBEURTENIS_API =
  'https://dev-inventaris.onroerenderfgoed.be/waarnemingsobjecten?bron_referentie_uri=https://dev-id.erfgoed.net/dossiers/158226';

const mock = new MockAdapter(axios);

const TestComponent = defineComponent({
  components: { OeInventarisLink },
  setup() {
    const attrs = useAttrs();
    return { attrs };
  },
  template: '<OeInventarisLink v-bind="attrs"></OeInventarisLink>',
});

describe('OeInventarisLink - no data', () => {
  const getSsoToken = async () => 1;
  it('renders', () => {
    mount(TestComponent, { props: { links: undefined, getSsoToken: getSsoToken } });
  });

  it('shows the links when urls are available', () => {
    mock.onGet(WAARNEMING_API).reply(200, [
      { id: 1, naam: 'Kardinaal Mercierlaan 66, Leuven', uri: 'https://dev-id.erfgoed.net/waarnemingen/1' },
      { id: 2, naam: 'Kardinaal Mercierlaan 67, Leuven', uri: 'https://dev-id.erfgoed.net/waarnemingen/2' },
    ] as IInventarisLinkWaarneming[]);
    mock.onGet(GEBEURTENIS_API).reply(200, [
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
    ] as IInventarisLinkGebeurtenis[]);
    const links = {
      relaties: {
        waarnemingen: {
          href: WAARNEMING_API,
        },
        gebeurtenissen: {
          href: GEBEURTENIS_API,
        },
      },
    } as ILinks;
    mount(TestComponent, { props: { links: links, getSsoToken: getSsoToken } });

    cy.dataCy('gekoppelde-waarnemingen-title').should('have.text', 'Gekoppelde waarnemingen');
    cy.dataCy('gekoppelde-gebeurtenissen-title').should('have.text', 'Gekoppelde gebeurtenissen');
  });
});
