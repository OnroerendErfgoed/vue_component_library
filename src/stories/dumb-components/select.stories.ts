import '@/scss/main.scss';
import OeSelect from '../../components/dumb/OeSelect.vue';
// import type { IAutocompleteOption } from '../../models/autocomplete';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta: Meta<typeof OeSelect> = {
  title: 'Dumb components/Select',
  component: OeSelect,
  tags: ['autodocs'],
  parameters: {
    docs: {
      story: {
        height: '250px',
      },
    },
  },
  argTypes: {
    // id: {
    //   control: 'text',
    //   description: 'Unique id for this autocomplete instance',
    // },
    // value: {
    //   control: 'object',
    //   description: 'Selected option',
    //   table: {
    //     type: { summary: 'IAutocompleteOption' },
    //     defaultValue: { summary: 'undefined' },
    //   },
    // },
    // autoselect: {
    //   control: 'boolean',
    //   description: 'Whether to autoselect the option if only 1 result is left',
    // },
    // minChars: {
    //   control: 'number',
    //   description: 'Number of characters needed before callbackFn is triggered',
    // },
    // placeholder: {
    //   control: 'text',
    //   description: 'Placeholder text',
    // },
    // callbackFn: {
    //   control: 'function',
    //   description: 'Callback function that provides the options',
    //   table: {
    //     type: { summary: 'Should return IAutocompleteOption[]' },
    //   },
    // },
  },
};

export default meta;
type Story = StoryObj<typeof OeSelect>;

export const Default: Story = {};

// export const CustomCallbackFunction: Story = {
//   render: () => ({
//     components: {
//       OeSelect,
//     },
//     setup() {
//       const callback = (s: string): Promise<IAutocompleteOption[]> => {
//         return new Promise(function (resolve) {
//           // Fake delay to show the loader
//           setTimeout(function () {
//             resolve([
//               {
//                 title: s,
//               },
//               {
//                 title: 'dummy',
//               },
//             ]);
//           }, 3000);
//         });
//       };

//       return { callback };
//     },
//     template: `<oe-autocomplete :callbackFn="callback"></oe-autocomplete>`,
//   }),
// };

export const Autoselect: Story = {
  render: () => ({
    components: {
      OeSelect,
    },
    // setup() {
    //   const callback = (): Promise<IAutocompleteOption[]> => {
    //     return new Promise(function (resolve) {
    //       // Fake delay to show the loader
    //       setTimeout(function () {
    //         resolve([
    //           {
    //             title: 'dummy',
    //           },
    //         ]);
    //       }, 3000);
    //     });
    //   };

    //   return { callback };
    // },
    template: `<oe-select></oe-select>`,
  }),
  //   parameters: {
  //     docs: {
  //       description: {
  //         story: 'Search for "dum" to have 1 result.',
  //       },
  //     },
  //   },
};
