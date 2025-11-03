/* eslint-disable vue/one-component-per-file */
import { defineComponent } from 'vue';
import OeHeader from '@components/core/dumb/OeHeader.vue';

describe('Header', () => {
  describe('Logged in', () => {
    const TestComponent = defineComponent({
      components: { OeHeader },
      data: () => ({
        appName: 'Application',
        user: {
          name: 'Doe, John',
          role: 'Beheerder',
        },
      }),
      template: '<OeHeader :appName="appName" :user="user"/>',
    });

    beforeEach(() => {
      cy.mount(TestComponent);
    });

    it('renders the given application name', () => {
      cy.dataCy('application-name').invoke('text').should('equal', 'Application');
    });

    it('renders the organisations logo', () => {
      cy.dataCy('logo').should('exist');
    });

    it('renders the given username', () => {
      cy.dataCy('user').find('h5').invoke('text').should('equal', 'Doe, John');
    });

    it('renders the given role', () => {
      cy.dataCy('role').invoke('text').should('equal', 'Beheerder');
    });

    it('toggles the dropdown navigation', () => {
      cy.dataCy('dropdown-navigation').find('.vl-popover__toggle').click();
      cy.dataCy('dropdown-navigation').find('.vl-popover').should('have.class', 'js-vl-popover--open');

      cy.dataCy('dropdown-navigation').find('.vl-popover__toggle').click();
      cy.dataCy('dropdown-navigation').find('.vl-popover').should('not.have.class', 'js-vl-popover--open');
    });

    it('has 3 navigation options', () => {
      cy.dataCy('navigation-list').children().should('have.length', 3);
    });

    describe('navigation options', () => {
      beforeEach(() => {
        cy.dataCy('dropdown-navigation').find('.vl-popover__toggle').click();
      });

      it('has option my profile', () => {
        cy.dataCy('navigation-profile')
          .should('exist')
          .should('have.attr', 'title', 'Ga naar mijn gegevens')
          .invoke('text')
          .should('equal', 'Mijn profiel');
      });

      it('has option change', () => {
        cy.dataCy('navigation-change')
          .should('exist')
          .should('have.attr', 'title', 'Wissel van profiel')
          .invoke('text')
          .should('equal', 'Wisselen');
      });

      it('has option logout', () => {
        cy.dataCy('navigation-logout')
          .should('exist')
          .should('have.attr', 'title', 'Meld je af')
          .invoke('text')
          .should('equal', 'Afmelden');
      });
    });

    it('does not have a logout shortcut', () => {
      cy.dataCy('logout-shortcut').should('not.exist');
    });
  });

  describe('Logged out', () => {
    const TestComponent = defineComponent({
      components: { OeHeader },
      data: () => ({
        appName: 'Application',
      }),
      template: '<OeHeader :appName="appName" :user="undefined"/>',
    });

    beforeEach(() => {
      cy.mount(TestComponent);
    });

    it('renders the given application name', () => {
      cy.dataCy('application-name').invoke('text').should('equal', 'Application');
    });

    it('renders the organisations logo', () => {
      cy.dataCy('logo').should('exist');
    });

    it('renders a login button', () => {
      cy.dataCy('login').should('exist').invoke('text').should('equal', 'Aanmelden');
    });

    it('does not render the user info', () => {
      cy.dataCy('user').should('not.exist');
    });

    it('should not have a dropdown navigation', () => {
      cy.dataCy('dropdown-navigation').should('not.exist');
    });
  });

  describe('Slot actions', () => {
    const TestComponent = defineComponent({
      components: { OeHeader },
      data: () => ({
        appName: 'Application',
      }),
      template: `<OeHeader :appName="appName"><template v-slot:actions>
      <button mod-naked class="vl-button">Action1</button>
      <button mod-naked class="vl-button">Action2</button>
      <button mod-naked class="vl-button">Action3</button></template></OeHeader>`,
    });

    beforeEach(() => {
      cy.mount(TestComponent);
    });

    it('renders the slot content in the actions region', () => {
      cy.dataCy('header-actions').children().should('have.length', 3);
    });
  });

  describe('With logout shortcut', () => {
    const TestComponent = defineComponent({
      components: { OeHeader },
      data: () => ({
        appName: 'Application',
        user: {
          name: 'Doe, John',
          role: 'Beheerder',
        },
      }),
      template: '<OeHeader :appName="appName" :user="user" :showLogoutShortcut="true"/>',
    });

    beforeEach(() => {
      cy.mount(TestComponent);
    });

    it('renders a logout shortcut', () => {
      cy.dataCy('logout-shortcut').should('exist');
    });
  });
});
