import SystemFields from '@components/smart/SystemFields.vue';
import { mount } from 'cypress/vue';
import { defineComponent } from 'vue';

const status = 'Klad';
const createdBy = 'Mr. Foo';
const createdAt = '2023-05-24T13:45:03.427155+02:00';
const updatedBy = 'Miss. Foo';
const updatedAt = '2023-05-24T13:45:03.497579+02:00';

describe('SystemFields - no data', () => {
  const TestComponent = defineComponent({
    components: { SystemFields },
    template: '<SystemFields></SystemFields>',
  });

  it('renders', () => {
    mount(TestComponent);
  });

  it('has an empty status field', () => {
    mount(TestComponent);
    cy.get('[data-cy="systemfield-status"]').should('have.text', 'Status: -');
  });

  it('has an empty aangemaakt door field', () => {
    mount(TestComponent);
    cy.get('[data-cy="systemfield-aangemaakt-door"]').should('have.text', 'Aangemaakt door: - op -');
  });
});

describe('SystemFields - default data', () => {
  const TestComponent = defineComponent({
    components: { SystemFields },
    template: '<SystemFields></SystemFields>',
  });

  it('should show klad status', () => {
    mount(TestComponent, {
      data: () => ({ status }),
      template: `<SystemFields :status="status"></SystemFields>`,
    });

    cy.get('[data-cy="systemfield-status"]').should('have.text', 'Status: Klad');
  });

  it('should show the right created by', () => {
    mount(TestComponent, {
      data: () => ({ createdBy }),
      template: `<SystemFields :created-by="createdBy"></SystemFields>`,
    });

    cy.get('[data-cy="systemfield-aangemaakt-door"]').should('have.text', 'Aangemaakt door: Mr. Foo op -');
  });

  it('should show the right created at', () => {
    mount(TestComponent, {
      data: () => ({ createdAt }),
      template: `<SystemFields :created-at="createdAt"></SystemFields>`,
    });

    cy.get('[data-cy="systemfield-aangemaakt-door"]').should('have.text', 'Aangemaakt door: - op 24/05/2023 om 13:45');
  });

  it('should show the right created at', () => {
    mount(TestComponent, {
      data: () => ({ createdAt }),
      template: `<SystemFields :created-at="createdAt"></SystemFields>`,
    });

    cy.get('[data-cy="systemfield-aangemaakt-door"]').should('have.text', 'Aangemaakt door: - op 24/05/2023 om 13:45');
  });

  it('should show the right updated by', () => {
    mount(TestComponent, {
      data: () => ({ updatedBy }),
      template: `<SystemFields :updated-by="updatedBy"></SystemFields>`,
    });

    cy.get('[data-cy="systemfield-laatst-bewerkt"]').should('have.text', 'Laatst bewerkt door: Miss. Foo op -');
  });

  it('should show the right updated at', () => {
    mount(TestComponent, {
      data: () => ({ updatedBy, updatedAt }),
      template: `<SystemFields :updatedBy="updatedBy" :updated-at="updatedAt"></SystemFields>`,
    });

    cy.get('[data-cy="systemfield-laatst-bewerkt"]').should(
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

    cy.get('[data-cy="systemfield-status"]').should('have.text', 'Status: Klad');
    cy.get('[data-cy="systemfield-aangemaakt-door"]').should(
      'have.text',
      'Aangemaakt door: Mr. Foo op 24/05/2023 om 13:45'
    );
    cy.get('[data-cy="systemfield-laatst-bewerkt"]').should(
      'have.text',
      'Laatst bewerkt door: Miss. Foo op 24/05/2023 om 13:45'
    );
  });
});

describe('SystemFields - slot data', () => {
  const TestComponent = defineComponent({
    components: { SystemFields },
    template: `<SystemFields>
    </SystemFields>`,
  });

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

    cy.get('[data-cy="systemfield-ul"]').children().should('have.length', '4');
  });
});
