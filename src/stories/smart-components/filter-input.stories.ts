import { VlSelect } from '@govflanders/vl-ui-design-system-vue3';
import FilterInput from '../../components/smart/FilterInput.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

import '@/scss/main.scss';

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta: Meta<typeof FilterInput> = {
  title: 'Smart components/FilterInput',
  component: FilterInput,
  tags: ['autodocs'],
  parameters: {
    docs: {
      story: {
        height: '400px',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FilterInput>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */
export const Default: Story = {
  render: () => ({
    components: {
      FilterInput,
      VlSelect,
    },
    template: `
      <filter-input>
        <template v-slot:select-filter="{value, setValue, selectedOption}">
          <vl-select v-if="selectedOption.key === 'status'" mod-block :value="value" @update:value="setValue">
            <optgroup label="Niet Actief">
              <option value="klad">Klad</option>
              <option value="kladzonderfoto">Klad zonder foto</option>
            </optgroup>
            <optgroup label="Actief">
              <option value="actief">Actief</option>
            </optgroup>
          </vl-select>
        </template>
      </filter-input>
    `,
  }),
};
