import OeContainer from '@components/dumb/OeContainer.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import '@/scss/main.scss';
import { VlButton } from '@govflanders/vl-ui-design-system-vue3';
import type { ITab } from '@models/container';
import { last, remove } from 'lodash';

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta: Meta<typeof OeContainer> = {
  title: 'Dumb components/Container',
  component: OeContainer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The container is a white flexbox element on a page. It will take the height of its content and will become scrollable when overflowing.\n\n',
      },
    },
    backgrounds: {
      default: 'gray',
      values: [{ name: 'gray', value: '#f3f3f3' }],
    },
    actions: {
      handles: ['tab-selected', 'click .btn'],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    default: {
      description: 'Default slot rendering the container content',
    },
    tabs: {
      control: 'object',
      description: 'Tabs to show at the bottom of the container',
      table: {
        type: { summary: 'ITab[]' },
      },
    },
    'tab-selected': {
      description: 'Emits selected tab on click',
      table: {
        type: { summary: 'ITab' },
      },
    },
    'tab-closed': {
      description: 'Emits selected tab on close',
      table: {
        type: { summary: 'ITab' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof OeContainer>;

export const Default: Story = {
  render: () => ({
    components: {
      OeContainer,
    },
    template: `
      <oe-container>
        <p class="vl-u-spacer-bottom--small">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Orci phasellus egestas tellus rutrum tellus pellentesque. Euismod quis viverra nibh cras pulvinar. Id leo in vitae turpis. Pretium lectus quam id leo. Dis parturient montes nascetur ridiculus mus. Enim facilisis gravida neque convallis a cras. Eget gravida cum sociis natoque penatibus et magnis. Nec nam aliquam sem et tortor consequat id porta. Non diam phasellus vestibulum lorem sed risus ultricies. Massa massa ultricies mi quis hendrerit dolor magna eget est. Eu nisl nunc mi ipsum faucibus vitae.</p> <br>
        <p>Viverra nibh cras pulvinar mattis nunc sed. Adipiscing elit pellentesque habitant morbi tristique senectus et netus. Nulla facilisi etiam dignissim diam quis enim. Ipsum consequat nisl vel pretium lectus. Eget nulla facilisi etiam dignissim diam quis enim lobortis scelerisque. Elit ut aliquam purus sit amet luctus venenatis lectus magna. Ultrices tincidunt arcu non sodales neque. Enim eu turpis egestas pretium aenean. Sit amet nisl purus in mollis nunc sed. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper dignissim. At tellus at urna condimentum mattis. Cum sociis natoque penatibus et. Lorem ipsum dolor sit amet consectetur adipiscing elit.</p>
      </oe-container>
    `,
  }),
};

export const Overflow: Story = {
  render: () => ({
    components: {
      OeContainer,
    },
    template: `
      <oe-container style="height: 200px">
        <p class="vl-u-spacer-bottom--small">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Orci phasellus egestas tellus rutrum tellus pellentesque. Euismod quis viverra nibh cras pulvinar. Id leo in vitae turpis. Pretium lectus quam id leo. Dis parturient montes nascetur ridiculus mus. Enim facilisis gravida neque convallis a cras. Eget gravida cum sociis natoque penatibus et magnis. Nec nam aliquam sem et tortor consequat id porta. Non diam phasellus vestibulum lorem sed risus ultricies. Massa massa ultricies mi quis hendrerit dolor magna eget est. Eu nisl nunc mi ipsum faucibus vitae.</p> <br>
        <p>Viverra nibh cras pulvinar mattis nunc sed. Adipiscing elit pellentesque habitant morbi tristique senectus et netus. Nulla facilisi etiam dignissim diam quis enim. Ipsum consequat nisl vel pretium lectus. Eget nulla facilisi etiam dignissim diam quis enim lobortis scelerisque. Elit ut aliquam purus sit amet luctus venenatis lectus magna. Ultrices tincidunt arcu non sodales neque. Enim eu turpis egestas pretium aenean. Sit amet nisl purus in mollis nunc sed. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper dignissim. At tellus at urna condimentum mattis. Cum sociis natoque penatibus et. Lorem ipsum dolor sit amet consectetur adipiscing elit.</p>
      </oe-container>
    `,
  }),
};

export const Tabs: Story = {
  parameters: {
    docs: {
      story: {
        height: '250px',
      },
      description: {
        story:
          'Tabs can passed into this components using the specified ITab interface.\n\r' +
          'The component will handle the tabs placement and will emit events for selecting and closing tab actions.\n\r' +
          'The consuming application is responsible for showing/hiding contents based on the selected tab that can be tracked watching the emitted events',
      },
    },
  },
  render: () => ({
    components: {
      OeContainer,
      VlButton,
    },
    setup: () => {
      const tabs = ref([{ label: 'Menu', id: 'menu', closable: false }]);
      const activeTab = ref<ITab>(tabs.value[0]);
      const addTab = () => {
        tabs.value.push({
          label: `Tab ${tabs.value.length.toString()}`,
          id: tabs.value.length.toString(),
          closable: true,
        });
        activeTab.value = last(tabs.value) as ITab;
      };
      const setActiveTab = (tab: ITab) => (activeTab.value = tab);
      const closeTab = (tab: ITab) => {
        remove(tabs.value, (item) => item.id === tab.id);
        activeTab.value = tabs.value[0];
      };

      return { tabs, activeTab, addTab, setActiveTab, closeTab };
    },
    template: `
     <oe-container style="height: 200px" :tabs="tabs" @tab-selected="setActiveTab" @tab-closed="closeTab">
      <div v-if="activeTab.id === 'menu'">
        <p class="vl-u-spacer--small">Dit is het menu overzicht</p>
        <vl-button @click="addTab">Open new tab</vl-button>
      </div>
       <div v-else>
        Actieve tab - {{ activeTab.label }}
       </div>
     </oe-container>
    `,
  }),
};
