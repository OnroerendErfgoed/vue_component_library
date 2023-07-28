/* eslint-disable vue/one-component-per-file */
import { OeContainer } from '@components/index';
import type { ITab } from '@models/container';
import { defineComponent, ref } from 'vue';

describe('Container', () => {
  describe('default', () => {
    it('renders the given slot content with text', () => {
      const TestComponent = defineComponent({
        components: { OeContainer },
        template: '<OeContainer>Container content</OeContainer>',
      });
      cy.mount(TestComponent);

      cy.dataCy('container-content').invoke('text').should('equal', 'Container content');
    });

    it('renders the given slot content with html', () => {
      const TestComponentHtml = defineComponent({
        components: { OeContainer },
        template: '<OeContainer><button>My button</button></OeContainer>',
      });
      cy.mount(TestComponentHtml);

      cy.dataCy('container-content').invoke('html').should('equal', '<button>My button</button>');
    });

    it("doesn't render tabs", () => {
      cy.dataCy('bottom-tabs').should('not.exist');
    });
  });

  describe('overflow', () => {
    const TestComponent = defineComponent({
      components: { OeContainer },
      template: `<oe-container style="height: 150px">
      <div>
        <p class="vl-u-spacer-bottom--small">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Orci phasellus egestas tellus rutrum tellus pellentesque. Euismod quis viverra nibh cras pulvinar. Id leo in vitae turpis. Pretium lectus quam id leo. Dis parturient montes nascetur ridiculus mus. Enim facilisis gravida neque convallis a cras. Eget gravida cum sociis natoque penatibus et magnis. Nec nam aliquam sem et tortor consequat id porta. Non diam phasellus vestibulum lorem sed risus ultricies. Massa massa ultricies mi quis hendrerit dolor magna eget est. Eu nisl nunc mi ipsum faucibus vitae.</p> <br>
        <p data-cy="hidden-content">Viverra nibh cras pulvinar mattis nunc sed. Adipiscing elit pellentesque habitant morbi tristique senectus et netus. Nulla facilisi etiam dignissim diam quis enim. Ipsum consequat nisl vel pretium lectus. Eget nulla facilisi etiam dignissim diam quis enim lobortis scelerisque. Elit ut aliquam purus sit amet luctus venenatis lectus magna. Ultrices tincidunt arcu non sodales neque. Enim eu turpis egestas pretium aenean. Sit amet nisl purus in mollis nunc sed. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper dignissim. At tellus at urna condimentum mattis. Cum sociis natoque penatibus et. Lorem ipsum dolor sit amet consectetur adipiscing elit.</p>
      </div>
      </oe-container>`,
    });

    beforeEach(() => {
      cy.mount(TestComponent);
    });

    it('renders the content in a scrollable container', () => {
      cy.dataCy('hidden-content').should('not.be.visible');
      cy.dataCy('container-content').scrollTo('bottom');
      cy.dataCy('hidden-content').should('be.visible');
    });
  });

  describe('tabs', () => {
    const TestComponent = defineComponent({
      components: { OeContainer },
      setup: () => {
        const tabs = ref([
          { label: 'Menu', id: 'menu', closable: false, editMode: false },
          { label: 'Tab 1', id: '1', closable: true, editMode: false },
          { label: 'Tab 2', id: '2', closable: true, editMode: false },
        ]);
        const activeTab = ref<ITab>(tabs.value[0]);

        return { tabs, activeTab };
      },
      template: `<oe-container :tabs="tabs" :active-tab="activeTab">Some content</oe-container>`,
    });

    it('renders the tabs at the bottom of the container', () => {
      cy.mount(TestComponent);

      cy.dataCy('bottom-tabs')
        .should('exist')
        .should('be.visible')
        .siblings()
        .invoke('text')
        .should('equal', 'Some content');
    });

    it('renders a tab for each item in the configured tabs', () => {
      cy.mount(TestComponent);

      cy.dataCy('bottom-tabs').find('.vl-pill').should('have.length', 3);
    });

    it('shows the tab label as text', () => {
      cy.mount(TestComponent).then(({ component }) => {
        cy.dataCy('bottom-tabs')
          .find('.vl-pill .vl-pill__text')
          .each((element, i) => {
            expect(element.text()).to.equal(component.tabs[i].label);
          });
      });
    });

    it('adds a custom class based on id for each tab', () => {
      cy.mount(TestComponent).then(({ component }) => {
        cy.dataCy('bottom-tabs')
          .find('.vl-pill')
          .each((element, i) => {
            expect(element.hasClass(`tab-${component.tabs[i].id}`)).to.equal(true);
          });
      });
    });

    it('renders a close button when the tab is configured as closable', () => {
      cy.mount(TestComponent);

      cy.dataCy('bottom-tabs').find('.tab-menu').should('be.visible').find('.vl-pill__close').should('not.exist');
      cy.dataCy('bottom-tabs').find('.tab-1').should('be.visible').find('.vl-pill__close').should('exist');
      cy.dataCy('bottom-tabs').find('.tab-2').should('be.visible').find('.vl-pill__close').should('exist');
    });

    it('adds a class is-active to the active tab', () => {
      cy.mount(TestComponent);

      cy.dataCy('bottom-tabs').find('.tab-menu').should('be.visible').should('have.class', 'is-active');
      cy.dataCy('bottom-tabs').find('.tab-1').should('be.visible').should('not.have.class', 'is-active');
      cy.dataCy('bottom-tabs').find('.tab-2').should('be.visible').should('not.have.class', 'is-active');
    });

    it('emits a tab-selected event with the selected tab on click', () => {
      const onTabSelectedSpy = cy.spy().as('onTabSelectedSpy');

      cy.mount(TestComponent, { props: { onTabSelected: onTabSelectedSpy } }).then(({ component }) => {
        cy.dataCy('bottom-tabs').find('.tab-1').click();

        cy.get('@onTabSelectedSpy').should(
          'have.been.calledWith',
          component.tabs.find((t) => t.id === '1')
        );
      });
    });

    it('emits a tab-closed event with the selected tab on close', () => {
      const onTabClosedSpy = cy.spy().as('onTabClosedSpy');

      cy.mount(TestComponent, { props: { onTabClosed: onTabClosedSpy } }).then(({ component }) => {
        cy.dataCy('bottom-tabs').find('.tab-1 .vl-pill__close').click();

        cy.get('@onTabClosedSpy').should(
          'have.been.calledWith',
          component.tabs.find((t) => t.id === '1')
        );
      });
    });
  });
});
