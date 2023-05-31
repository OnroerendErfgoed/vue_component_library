import OeHeader from '@components/dumb/OeHeader.vue';
import { defineComponent } from 'vue';

describe('Header', () => {
  describe('default', () => {
    const TestComponent = defineComponent({
      components: { OeHeader },
      data: () => ({
        appName: 'Application',
        username: 'Doe, John',
        role: 'Beheerder',
      }),

      template: '<OeHeader :appName="appName" :username="username" :role="role"/>',
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
      cy.dataCy('username').find('h5').invoke('text').should('equal', 'Doe, John');
    });

    it('renders the given role', () => {
      cy.dataCy('role').invoke('text').should('equal', 'Beheerder');
    });
  });
});
