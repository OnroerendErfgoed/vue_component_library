import '@/scss/main.scss';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { OeInventarisLink } from '@components/smart';
import type { Meta, StoryObj } from '@storybook/vue3';
import type { IInventarisLinkGebeurtenis, IInventarisLinkWaarneming, ILinks } from '@models/links';

const WAARNEMING_API =
  'https://dev-inventaris.onroerenderfgoed.be/gebeurtenissen?bron_referentie_uri=https://dev-id.erfgoed.net/dossiers/158226';
const GEBEURTENIS_API =
  'https://dev-inventaris.onroerenderfgoed.be/waarnemingsobjecten?bron_referentie_uri=https://dev-id.erfgoed.net/dossiers/158226';

const mock = new MockAdapter(axios);
// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta: Meta<typeof OeInventarisLink> = {
  title: 'Smart components/OeInventarisLink',
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
