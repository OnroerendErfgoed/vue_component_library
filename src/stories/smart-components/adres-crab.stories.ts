import '@/scss/main.scss';
import AdresCrab from '@components/smart/AdresCrab.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta: Meta<typeof AdresCrab> = {
  title: 'Smart components/AdresCrab',
  component: AdresCrab,
  tags: ['autodocs'],
  render: (args) => ({
    components: { AdresCrab },
    inheritAttrs: false,
    setup() {
      return { args };
    },
    template: `
      <Suspense>
        <AdresCrab v-bind="args" />
      </Suspense>
    `,
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
type Story = StoryObj<typeof AdresCrab>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */
export const Default: Story = {};

export const CustomApi: Story = {
  args: {
    api: 'https://dev-geo.onroerenderfgoed.be/',
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
      land: 'BE',
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
  },
  render: ({ adres }) => ({
    components: { AdresCrab },
    inheritAttrs: false,
    setup() {
      return { adres };
    },
    template: `
      <Suspense>
        <AdresCrab v-model:adres="adres" />
      </Suspense>
    `,
  }),
};

export const MultiSelectOptionsLimit: Story = {
  args: {
    optionsLimit: 5000,
  },
};
