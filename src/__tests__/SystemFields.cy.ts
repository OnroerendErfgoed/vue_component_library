import { mount } from 'cypress/vue';
import { defineComponent } from 'vue';
import SystemFields from '@components/core/dumb/OeSystemFields.vue';

const status = 'Klad';
const createdBy = 'Mr. Foo';
const createdAt = '2023-05-24T13:45:03.427155+02:00';
const updatedBy = 'Miss. Foo';
const updatedAt = '2023-05-24T13:45:03.497579+02:00';

const TestComponent = defineComponent({
  components: { SystemFields },
  template: '<SystemFields></SystemFields>',
});

describe('SystemFields - no data', () => {
  it('renders', () => {
    mount(TestComponent);
  });

  it('hides the status field when empty', () => {
    mount(TestComponent);
    cy.dataCy('systemfield-status').should('not.exist');
  });

  it('has an empty aangemaakt door field', () => {
    mount(TestComponent);
    cy.dataCy('systemfield-aangemaakt-door').should('have.text', 'Aangemaakt door: - op -');
  });
});

describe('SystemFields - default data', () => {
  it('should show klad status', () => {
    mount(TestComponent, {
      data: () => ({ status }),
      template: `<SystemFields :status="status"></SystemFields>`,
    });

    cy.dataCy('systemfield-status').should('have.text', 'Status: Klad');
  });

  it('should show the right created by', () => {
    mount(TestComponent, {
      data: () => ({ createdBy }),
      template: `<SystemFields :created-by="createdBy"></SystemFields>`,
    });

    cy.dataCy('systemfield-aangemaakt-door').should('have.text', 'Aangemaakt door: Mr. Foo op -');
  });

  it('should show the right created at', () => {
    mount(TestComponent, {
      data: () => ({ createdAt }),
      template: `<SystemFields :created-at="createdAt"></SystemFields>`,
    });

    cy.dataCy('systemfield-aangemaakt-door').should('have.text', 'Aangemaakt door: - op 24/05/2023 om 13:45');
  });

  it('should show the right created at', () => {
    mount(TestComponent, {
      data: () => ({ createdAt }),
      template: `<SystemFields :created-at="createdAt"></SystemFields>`,
    });

    cy.dataCy('systemfield-aangemaakt-door').should('have.text', 'Aangemaakt door: - op 24/05/2023 om 13:45');
  });

  it('should show the right updated by', () => {
    mount(TestComponent, {
      data: () => ({ updatedBy }),
      template: `<SystemFields :updated-by="updatedBy"></SystemFields>`,
    });

    cy.dataCy('systemfield-laatst-bewerkt').should('have.text', 'Laatst bewerkt door: Miss. Foo op -');
  });

  it('should show the right updated at', () => {
    mount(TestComponent, {
      data: () => ({ updatedBy, updatedAt }),
      template: `<SystemFields :updatedBy="updatedBy" :updated-at="updatedAt"></SystemFields>`,
    });

    cy.dataCy('systemfield-laatst-bewerkt').should(
      'have.text',
      'Laatst bewerkt door: Miss. Foo op 24/05/2023 om 13:45'
    );
  });

  it('should show the right fields', () => {
    mount(TestComponent, {
      data: () => ({ status, createdBy, createdAt, updatedBy, updatedAt }),
      template: `<SystemFields
      :status="status"
      :created-by="createdBy"
      :created-at="createdAt"
      :updated-by="updatedBy"
      :updated-at="updatedAt"></SystemFields>`,
    });

    cy.dataCy('systemfield-status').should('have.text', 'Status: Klad');
    cy.dataCy('systemfield-aangemaakt-door').should('have.text', 'Aangemaakt door: Mr. Foo op 24/05/2023 om 13:45');
    cy.dataCy('systemfield-laatst-bewerkt').should(
      'have.text',
      'Laatst bewerkt door: Miss. Foo op 24/05/2023 om 13:45'
    );
  });
});

describe('SystemFields - slot data', () => {
  it('should have 4 list items', () => {
    mount(TestComponent, {
      data: () => ({ status, createdBy, createdAt, updatedBy, updatedAt }),
      template: `<SystemFields
      :status="status"
      :created-by="createdBy"
      :created-at="createdAt"
      :updated-by="updatedBy"
      :updated-at="updatedAt">
      <li>Extra item met werkende HTML</li>
      </SystemFields>`,
    });

    cy.dataCy('systemfield-ul').children().should('have.length', '4');
  });
});
