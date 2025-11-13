import MockAdapter from 'axios-mock-adapter';
import { IInventarisLinkGebeurtenis, IInventarisLinkWaarneming, ILinks } from '@components/core/models/links';
import OeInventarisLink from '@components/core/smart/OeInventarisLink.vue';
import { axiosInstance } from '@services/http.service';
import type { Meta, StoryObj } from '@storybook/vue3';

const WAARNEMING_API =
  'https://dev-inventaris.onroerenderfgoed.be/gebeurtenissen?bron_referentie_uri=https://dev-id.erfgoed.net/dossiers/158226';
const GEBEURTENIS_API =
  'https://dev-inventaris.onroerenderfgoed.be/waarnemingsobjecten?bron_referentie_uri=https://dev-id.erfgoed.net/dossiers/158226';

const mock = new MockAdapter(axiosInstance);
const meta: Meta<typeof OeInventarisLink> = {
  title: 'Core Module/Inventaris Link',
  component: OeInventarisLink,
  parameters: {
    docs: {
      description: {
        component: `Component to show inventaris waarnemingen/gebeurtenissen if the link property is available`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    links: {
      description: 'property that will contain the waarneming/gebeurtenis urls',
      table: {
        type: { summary: 'links' },
      },
    },
    getSsoToken: {
      description: 'Method that gets authentication token',
      table: {
        type: { summary: 'getSsoToken' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof OeInventarisLink>;

export const Default: Story = {
  render: () => ({
    components: {
      OeInventarisLink,
    },
    setup() {
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
      const getSsoToken = async () => 1;
      return { links, getSsoToken };
    },
    template: `
    <div>
    <OeInventarisLink :links="links" :get-sso-token="getSsoToken"></OeInventarisLink>
    </div>
    `,
  }),
};

export const NoLinksPresent: Story = {
  args: {
    links: undefined,
    getSsoToken: async () => '1',
  },
};
