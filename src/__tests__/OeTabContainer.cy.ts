import { defineComponent, type Component } from 'vue';
import OeTabContainer from '@/components/dumb/OeTabContainer.vue';
import type { ITabView } from '@models/tab-container';

describe('TabContainer', () => {
  const TestComponent = defineComponent({
    components: { OeTabContainer },
    setup() {
      const tabs: ITabView[] = [
        {
          id: 'algemeen',
          label: 'Algemeen',
          component: {} as Component,
        },
        {
          id: 'zone',
          label: 'Zone',
          component: {} as Component,
        },
      ];

      return { tabs };
    },
    template: `
      <oe-tab-container :tabs="tabs">
        <template #default="{ activeTab }">
          <h2>Tab {{ activeTab.label }}</h2>
        </template>
      </oe-tab-container>
      `,
  });

  beforeEach(() => {
    cy.mount(TestComponent);
  });

  it('renders a tab container', () => {
    cy.dataCy('tab-container').should('exist').should('have.class', 'tab-container');
  });

  it('renders a tab for each given tab', () => {
    cy.mount(TestComponent).then(({ component }) => {
      cy.dataCy('top-tabs')
        .children()
        .should('have.length', 2)
        .each((tab, index) => {
          expect(tab.text()).to.equal(`${component.tabs[index].label}`);
        });
    });
  });
});
