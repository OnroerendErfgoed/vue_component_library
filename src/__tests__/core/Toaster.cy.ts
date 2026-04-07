/* eslint-disable vue/one-component-per-file */
import { useUtilStore } from '@stores/utilStore';
import { createPinia } from 'pinia';
import { defineComponent } from 'vue';
import OeToaster from '@components/core/dumb/OeToaster.vue';
import type { ToastType } from '@models/toast';

const globalPlugins = () => ({ global: { plugins: [createPinia()] } });

const mountToasterWithToast = (type: ToastType, content: string | string[] = 'Toast content') => {
  const TestComponent = defineComponent({
    components: { OeToaster },
    setup() {
      const store = useUtilStore();
      store.addToast({ title: 'Toast title', content, type });
      return { store };
    },
    template: '<OeToaster />',
  });
  cy.mount(TestComponent, globalPlugins());
};

describe('OeToaster', () => {
  describe('rendering', () => {
    it('renders empty when there are no toasts', () => {
      const TestComponent = defineComponent({
        components: { OeToaster },
        template: '<OeToaster />',
      });
      cy.mount(TestComponent, globalPlugins());

      cy.get('.vl-alert').should('not.exist');
    });

    it('renders a toast when one is added to the store', () => {
      mountToasterWithToast('success');

      cy.get('.vl-alert').should('exist').and('be.visible');
      cy.get('.vl-alert').should('contain.text', 'Toast title');
      cy.get('.vl-alert').should('contain.text', 'Toast content');
    });

    it('renders multiple toasts', () => {
      const TestComponent = defineComponent({
        components: { OeToaster },
        setup() {
          const store = useUtilStore();
          store.addToast({ title: 'First toast', content: 'First content', type: 'success' });
          store.addToast({ title: 'Second toast', content: 'Second content', type: 'error' });
          store.addToast({ title: 'Third toast', content: 'Third content', type: 'warning' });
          return { store };
        },
        template: '<OeToaster />',
      });
      cy.mount(TestComponent, globalPlugins());

      cy.get('.vl-alert').should('have.length', 3);
      cy.get('.vl-alert').eq(0).should('contain.text', 'First toast');
      cy.get('.vl-alert').eq(1).should('contain.text', 'Second toast');
      cy.get('.vl-alert').eq(2).should('contain.text', 'Third toast');
    });
  });

  describe('toast types', () => {
    it('renders a success toast with check icon and success modifier', () => {
      mountToasterWithToast('success');

      cy.get('.vl-alert').should('have.class', 'vl-alert--success');
    });

    it('renders an error toast with warning icon and error modifier', () => {
      mountToasterWithToast('error');

      cy.get('.vl-alert').should('have.class', 'vl-alert--error');
    });

    it('renders a warning toast with warning icon and warning modifier', () => {
      mountToasterWithToast('warning');

      cy.get('.vl-alert').should('have.class', 'vl-alert--warning');
    });
  });

  describe('content rendering', () => {
    it('renders string content as HTML', () => {
      mountToasterWithToast('success', 'Simple text content');

      cy.get('.vl-alert').should('contain.text', 'Simple text content');
    });

    it('renders array content as a list', () => {
      mountToasterWithToast('success', ['Message one', 'Message two', 'Message three']);

      cy.get('.vl-alert ul').should('exist');
      cy.get('.vl-alert ul li').should('have.length', 3);
      cy.get('.vl-alert ul li').eq(0).should('have.text', 'Message one');
      cy.get('.vl-alert ul li').eq(1).should('have.text', 'Message two');
      cy.get('.vl-alert ul li').eq(2).should('have.text', 'Message three');
    });
  });

  describe('closing toasts', () => {
    it('removes a toast when the close button is clicked', () => {
      mountToasterWithToast('success');

      cy.get('.vl-alert').should('exist');
      cy.get('.vl-alert button[type="button"]').click();
      cy.get('.vl-alert').should('not.exist');
    });

    it('removes the correct toast when there are multiple', () => {
      const TestComponent = defineComponent({
        components: { OeToaster },
        setup() {
          const store = useUtilStore();
          store.addToast({ title: 'Keep this', content: 'Stays', type: 'success' });
          store.addToast({ title: 'Remove this', content: 'Goes away', type: 'error' });
          return { store };
        },
        template: '<OeToaster />',
      });
      cy.mount(TestComponent, globalPlugins());

      cy.get('.vl-alert').should('have.length', 2);
      cy.get('.vl-alert').eq(1).find('button[type="button"]').click();
      cy.get('.vl-alert').should('have.length', 1);
      cy.get('.vl-alert').should('contain.text', 'Keep this');
    });
  });

  describe('closeOnClick prop', () => {
    it('does not add close-on-click class when prop is false', () => {
      const TestComponent = defineComponent({
        components: { OeToaster },
        setup() {
          const store = useUtilStore();
          store.addToast({ title: 'Toast', content: 'Content', type: 'success' });
        },
        template: '<OeToaster :close-on-click="false" />',
      });
      cy.mount(TestComponent, globalPlugins());

      cy.get('.vl-alert').should('not.have.class', 'close-on-click');
    });

    it('adds close-on-click class when prop is true', () => {
      const TestComponent = defineComponent({
        components: { OeToaster },
        setup() {
          const store = useUtilStore();
          store.addToast({ title: 'Toast', content: 'Content', type: 'success' });
        },
        template: '<OeToaster close-on-click />',
      });
      cy.mount(TestComponent, globalPlugins());

      cy.get('.vl-alert').should('have.class', 'close-on-click');
    });

    it('removes toast when clicked and closeOnClick is true', () => {
      const TestComponent = defineComponent({
        components: { OeToaster },
        setup() {
          const store = useUtilStore();
          store.addToast({ title: 'Click me', content: 'I will disappear', type: 'success' });
        },
        template: '<OeToaster close-on-click />',
      });
      cy.mount(TestComponent, globalPlugins());

      cy.get('.vl-alert').should('exist');
      cy.get('.vl-alert').click();
      cy.get('.vl-alert').should('not.exist');
    });
  });

  describe('auto-dismiss with duration', () => {
    it('automatically removes a toast after the specified duration', () => {
      const TestComponent = defineComponent({
        components: { OeToaster },
        setup() {
          const store = useUtilStore();
          store.addToast({ title: 'Auto dismiss', content: 'Goes away', type: 'success' }, 1000);
        },
        template: '<OeToaster />',
      });
      cy.mount(TestComponent, globalPlugins());

      cy.get('.vl-alert').should('exist');
      cy.wait(1100);
      cy.get('.vl-alert').should('not.exist');
    });
  });

  describe('reactivity', () => {
    it('reactively adds new toasts', () => {
      const TestComponent = defineComponent({
        components: { OeToaster },
        setup() {
          const store = useUtilStore();
          return { store };
        },
        template: `
          <button data-cy="add-toast" @click="store.addToast({ title: 'New toast', content: 'Added later', type: 'success' })">
            Add
          </button>
          <OeToaster />
        `,
      });
      cy.mount(TestComponent, globalPlugins());

      cy.get('.vl-alert').should('not.exist');
      cy.get('[data-cy="add-toast"]').click();
      cy.get('.vl-alert').should('have.length', 1).and('contain.text', 'New toast');
      cy.get('[data-cy="add-toast"]').click();
      cy.get('.vl-alert').should('have.length', 2);
    });
  });
});
