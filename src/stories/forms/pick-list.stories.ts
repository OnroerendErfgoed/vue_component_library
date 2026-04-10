import { VlSelect } from '@govflanders/vl-ui-design-system-vue3';
import { ref } from 'vue';
import { OePickList } from '@components/forms';
import type { Meta, StoryObj } from '@storybook/vue3';

interface Fruit {
  id: number;
  name: string;
}

const sampleItems: Fruit[] = [
  { id: 1, name: 'Appel' },
  { id: 2, name: 'Banaan' },
  { id: 3, name: 'Citroen' },
];

const meta: Meta<typeof OePickList> = {
  title: 'Forms Module/PickList',
  component: OePickList,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A list component that displays selected items with optional remove functionality. Supports a generic type for items and a custom `itemText` function to render item labels.',
      },
    },
  },
  argTypes: {
    selectedItems: {
      control: 'object',
      description: 'Array of selected items to display in the list',
      table: {
        type: { summary: 'T[]' },
        defaultValue: { summary: '[]' },
      },
    },
    itemLabel: {
      control: 'text',
      description: 'Label used in the remove button aria-label',
      table: {
        type: { summary: 'string' },
      },
    },
    itemText: {
      description: 'Function that returns the display text for an item',
      table: {
        type: { summary: '(item: T) => string' },
      },
    },
    isEditMode: {
      control: 'boolean',
      description: 'Whether the list is in edit mode (shows delete buttons and input slot)',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the list and its input slot are disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    unselect: {
      description: 'Emitted when an item is removed from the list',
      table: {
        type: { summary: '(item: T) => void' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof OePickList>;

export const Default: Story = {
  render: () => ({
    components: { OePickList, VlSelect },
    setup() {
      const selectValue = ref<string>();
      const items = ref<Fruit[]>([...sampleItems]);
      const itemText = (item: Fruit) => item.name;
      const onSelect = (item: Fruit) => {
        if (!items.value.includes(item)) {
          items.value.push(item);
        }
        selectValue.value = '';
      };
      const onUnselect = (item: Fruit) => {
        items.value = items.value.filter((i) => i.id !== item.id);
      };
      return { selectValue, items, sampleItems, itemText, onSelect, onUnselect };
    },
    template: `
      <OePickList :selected-items="items" item-label="fruit" :item-text="itemText" is-edit-mode @unselect="onUnselect">
        <template #input>
          <VlSelect mod-block v-model="selectValue" placeholder-text="Zoek een fruit..." @change="onSelect(selectValue)">
            <option v-for="item in sampleItems" :key="item.id" :value="item">{{ item.name }}</option>
          </VlSelect>
        </template>
      </OePickList>
    `,
  }),
};

export const Disabled: Story = {
  render: () => ({
    components: { OePickList, VlSelect },
    setup() {
      const items = ref<Fruit[]>([...sampleItems]);
      const itemText = (item: Fruit) => item.name;
      return { items, sampleItems, itemText };
    },
    template: `
      <OePickList :selected-items="items" item-label="fruit" :item-text="itemText" is-edit-mode disabled>
        <template #input>
          <VlSelect mod-block placeholder-text="Zoek een fruit..." disabled>
            <option v-for="item in sampleItems" :key="item.id" :value="item">{{ item.name }}</option>
          </VlSelect>
        </template>
      </OePickList>
    `,
  }),
};

export const ReadMode: Story = {
  render: () => ({
    components: { OePickList, VlSelect },
    setup() {
      const items = ref<Fruit[]>([...sampleItems]);
      const itemText = (item: Fruit) => item.name;
      return { items, sampleItems, itemText };
    },
    template: `
      <OePickList :selected-items="items" item-label="fruit" :item-text="itemText" :is-edit-mode="false">
        <template #input>
          <VlSelect mod-block placeholder-text="Zoek een fruit...">
            <option v-for="item in sampleItems" :key="item.id" :value="item">{{ item.name }}</option>
          </VlSelect>
        </template>
      </OePickList>
    `,
  }),
};
