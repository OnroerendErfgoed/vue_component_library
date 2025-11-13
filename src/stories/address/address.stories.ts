import { VlButton } from '@govflanders/vl-ui-design-system-vue3';
import OeAdres from '@components/address/OeAdres.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import type { ILocatieAdres } from '@models/locatie';

const meta: Meta<typeof OeAdres> = {
  title: 'Address Module/Adres',
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
      <OeAdres v-bind="args" @update:adres="onUpdateAdres" />
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
    titleText: {
      control: 'text',
      description: 'Title text',
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

export const AdminMode: Story = {
  args: {
    adminMode: true,
  },
};

export const ShowRequiredAnnotationPerField: Story = {
  args: {
    showRequiredPerField: true,
  },
};

export const FormValidation: Story = {
  render: () => ({
    components: { OeAdres, VlButton },
    template: `
      <div>
        <OeAdres ref="oeAdres" v-model:adres="adres" :config="config" show-required-per-field />
        <VlButton @click="validateForm" style="margin-top: 16px; float: right;">Validate Form</VlButton>
      </div>
    `,
    methods: {
      validateForm() {
        this.$refs.oeAdres.validate();
      },
    },
  }),
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
      gewest: { required: true },
      provincie: { required: false },
      gemeente: { required: true },
      postcode: { required: false, hidden: true },
      straat: { required: false },
      huisnummer: { required: false },
      busnummer: { required: false, hidden: true },
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
        naam: 'België',
        code: 'BE',
      },
      gewest: {
        naam: 'Vlaams Gewest',
        niscode: '2000',
      },
      provincie: {
        naam: 'Vlaams-Brabant',
        niscode: '20001',
      },
      gemeente: {
        naam: 'Bertem',
        niscode: '24009',
      },
      postcode: {
        nummer: '3060',
      },
      straat: {
        naam: 'Dorpstraat',
        id: '32110',
      },
      adres: {
        huisnummer: '416',
        busnummer: '0101',
      },
    },
    config: {
      land: { required: true },
      gewest: { required: true },
      provincie: { required: false },
      gemeente: { required: true },
      postcode: { required: true },
      straat: { required: false },
      huisnummer: { required: false },
      busnummer: { required: false },
    },
  },
  render: ({ adres, config }) => ({
    components: { OeAdres },
    inheritAttrs: false,
    setup() {
      return { adres, config };
    },
    template: `
      <div>
      <OeAdres v-model:adres="adres" :config="config" @update:adres="onUpdateAdres" />
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

export const CountryWithEnrichedData: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'This story demonstrates the component with a country that has enriched data (like a flag), such as Bahrain.',
      },
    },
  },
  args: {
    adres: {
      land: {
        code: 'BH',
        naam: 'Bahrain',
      },
      gemeente: {
        naam: 'Manama',
      },
      postcode: {
        nummer: '12345',
      },
      straat: {
        naam: 'Al-Fateh Highway',
      },
      adres: {
        huisnummer: '123',
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
      <OeAdres v-model:adres="adres"  @update:adres="onUpdateAdres" />
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
