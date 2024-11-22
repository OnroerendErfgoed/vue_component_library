import '@/scss/main.scss';
import OeAdres from '@components/smart/OeAdres.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import type { ILocatieAdres } from '@models/locatie';

const meta: Meta<typeof OeAdres> = {
  title: 'Smart components/Adres',
  component: OeAdres,
  tags: ['autodocs'],
  render: (args) => ({
    components: { OeAdres },
    inheritAttrs: false,
    setup() {
      return { args };
    },
    template: `
      <div>
      <Suspense>
        <OeAdres v-bind="args" @update:adres="onUpdateAdres" />
      </Suspense>
      <h3>Adres:</h3>
      <pre>{{ eventOutput }}</pre>
      </div>
    `,
    data() {
      return {
        eventOutput: '' as string,
      };
    },
    methods: {
      onUpdateAdres(payload: ILocatieAdres) {
        this.eventOutput = payload;
      },
    },
  }),
  argTypes: {
    config: {
      control: 'object',
      description: 'Configuration per field',
    },
    api: {
      control: 'text',
      description: 'API host url',
    },
    countryId: {
      control: 'text',
      description: 'Pre selected country - input will be hidden',
    },
    adres: {
      control: 'object',
      description: 'Pre selected adres',
    },
    optionsLimit: {
      control: 'number',
      description: 'Max. amount of items in a multi-select list',
    },
  },
};

export default meta;
type Story = StoryObj<typeof OeAdres>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */
export const Default: Story = {};

export const ShowRequiredAnnotationPerField: Story = {
  args: {
    showRequiredPerField: true,
  },
};

export const DisabledState: Story = {
  args: {
    modDisabled: true,
  },
};

export const CustomApi: Story = {
  args: {
    api: 'https://test-geo.onroerenderfgoed.be/',
  },
};

export const CustomConfig: Story = {
  args: {
    config: {
      land: { required: true },
      gemeente: { required: true },
      postcode: { required: false },
      straat: { required: false },
      huisnummer: { required: false },
      busnummer: { required: false },
    },
  },
};

export const SpecificCountry: Story = {
  args: {
    countryId: 'BE',
  },
};

export const TwoWayBinding: Story = {
  args: {
    adres: {
      land: {
        code: 'BE',
        naam: 'België',
      },
      gemeente: {
        naam: 'Bertem',
        niscode: '24009',
      },
      postcode: {
        nummer: '3060',
        uri: 'https://data.vlaanderen.be/id/postinfo/3060',
      },
      straat: {
        naam: 'Dorpstraat',
        id: '32110',
        uri: 'https://data.vlaanderen.be/id/straatnaam/32110',
      },
      adres: {
        huisnummer: '416',
        busnummer: '0101',
        uri: 'https://data.vlaanderen.be/id/adres/993686',
        id: '993686',
      },
    },
  },
  render: ({ adres }: ILocatieAdres) => ({
    components: { OeAdres },
    inheritAttrs: false,
    setup() {
      return { adres };
    },
    template: `
      <div>
      <Suspense>
        <OeAdres v-model:adres="adres"  @update:adres="onUpdateAdres" />
      </Suspense>
      <h3>Adres:</h3>
      <pre>{{ eventOutput }}</pre>
      </div>
    `,
    data() {
      return {
        eventOutput: '' as string,
      };
    },
    methods: {
      onUpdateAdres(payload: ILocatieAdres) {
        this.eventOutput = payload;
      },
    },
  }),
};

export const OldAddresses: Story = {
  args: {
    adres: {
      land: {
        code: 'BE',
        naam: 'België',
      },
      gemeente: {
        naam: 'Herzele',
        niscode: '41027',
      },
      postcode: {
        nummer: '9550',
        uri: 'https://data.vlaanderen.be/id/postinfo/9550',
      },
      straat: {
        naam: 'Provincieweg',
        id: '229270',
        uri: 'https://data.vlaanderen.be/doc/straatnaam/229270',
      },
    },
  },
  render: ({ adres }: ILocatieAdres) => ({
    components: { OeAdres },
    inheritAttrs: false,
    setup() {
      return { adres };
    },
    template: `
      <div>
      <Suspense>
        <OeAdres v-model:adres="adres"  @update:adres="onUpdateAdres" />
      </Suspense>
      <h3>Adres:</h3>
      <pre>{{ eventOutput }}</pre>
      </div>
    `,
    data() {
      return {
        eventOutput: '' as string,
      };
    },
    methods: {
      onUpdateAdres(payload: ILocatieAdres) {
        this.eventOutput = payload;
      },
    },
  }),
};

export const MultiSelectOptionsLimit: Story = {
  args: {
    optionsLimit: 5000,
  },
};
