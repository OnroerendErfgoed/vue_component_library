/* eslint-disable vue/one-component-per-file */
import { defineComponent, ref } from 'vue';
import OeSelect from '@components/dumb/OeSelect.vue';
import type { ISelectOption } from '@models/select';

describe('Select', () => {
  const select = () => cy.dataCy('oe-select');
  const dropdown = () => cy.get('.vl-select__list.vl-select__list--dropdown');
  const selectItemPlaceholder = () => cy.get('.vl-select__item.vl-select__item--choice.is-placeholder');
  const selectedItem = () => cy.get('.vl-select__item.vl-select__item--selectable');
  const selectableItems = () => cy.get('.vl-select__item.vl-select__item--choice.vl-select__item--selectable');

  describe('default', () => {
    const TestComponent = defineComponent({
      components: { OeSelect },
      setup() {
        const modelValue = ref<ISelectOption>();
        const options: ISelectOption[] = [
          { label: 'België', value: 'België' },
          { label: 'Frankrijk', value: 'Frankrijk' },
          { label: 'Duitsland - Land in Centraal-Europa.', value: 'Duitsland' },
        ];
        const customLabel = (option: ISelectOption) => option?.label;

        return { options, customLabel, modelValue };
      },
      template: '<OeSelect v-model="modelValue" :custom-label="customLabel" :options="options"/>',
    });

    it('renders a custom select with placeholder', () => {
      cy.mount(TestComponent);
      cy.get('.js-vl-select')
        .should('exist')
        .should('be.visible')
        .find('.vl-select__inner > .vl-input-field')
        .should('be.visible')
        .find('.vl-select__item.item--placeholder')
        .invoke('text')
        .should('equal', 'Selecteer een optie');
    });

    it('does not show the dropdown', () => {
      cy.mount(TestComponent);
      dropdown().should('not.exist');
    });

    it('shows the dropdown when clicking at the select element', () => {
      cy.mount(TestComponent);
      select().click();
      dropdown().should('exist');
    });

    it('renders the placeholder as first element', () => {
      cy.mount(TestComponent);
      select().click();
      selectItemPlaceholder().invoke('text').should('equal', 'Selecteer een optie');
    });

    it('renders all options with custom label', () => {
      cy.mount(TestComponent).then(({ component }) => {
        select().click();
        selectableItems().each((option, i) => {
          expect(option.text()).to.equal(component.options[i].label);
        });
      });
    });

    it('updates the model value and closes the dropdown when item is selected', () => {
      cy.mount(TestComponent).then(({ component }) => {
        select().click();
        selectableItems()
          .first()
          .click()
          .then(() => {
            selectedItem().invoke('text').should('equal', component.options[0].label);
            expect(component.modelValue).to.deep.equal(component.options[0]);
            dropdown().should('not.exist');
          });
      });
    });

    it('highlights the selected item', () => {
      cy.mount(TestComponent);
      select().click();
      selectableItems()
        .first()
        .click()
        .then(() => {
          select().click();
          selectableItems().first().should('have.class', 'is-highlighted');
          selectableItems().last().should('not.have.class', 'is-highlighted');
        });
    });
  });

  describe('custom placeholder', () => {
    const TestComponent = defineComponent({
      components: { OeSelect },
      template: '<OeSelect placeholder="My custom placeholder"/>',
    });

    it('renders a select with custom placeholder', () => {
      cy.mount(TestComponent);
      cy.get('.js-vl-select')
        .should('exist')
        .should('be.visible')
        .find('.vl-select__inner > .vl-input-field')
        .should('be.visible')
        .find('.vl-select__item.item--placeholder')
        .invoke('text')
        .should('equal', 'My custom placeholder');
    });

    it('renders the custom placeholder as first element', () => {
      cy.mount(TestComponent);
      select().click();
      selectItemPlaceholder().invoke('text').should('equal', 'My custom placeholder');
    });
  });

  describe('selected value', () => {
    const TestComponent = defineComponent({
      components: { OeSelect },
      setup() {
        const modelValue = ref<ISelectOption>({ label: 'België', value: 'België' });
        const options: ISelectOption[] = [
          { label: 'België', value: 'België' },
          { label: 'Frankrijk', value: 'Frankrijk' },
          { label: 'Duitsland - Land in Centraal-Europa.', value: 'Duitsland' },
        ];
        const customLabel = (option: ISelectOption) => option?.label;

        return { options, customLabel, modelValue };
      },
      template: '<OeSelect v-model="modelValue" :custom-label="customLabel" :options="options"/>',
    });

    it('selects the initial boundend value', () => {
      cy.mount(TestComponent).then(({ component }) => {
        selectedItem().invoke('text').should('equal', component.modelValue.label);
      });
    });

    it('updates the value after modelValue changed', () => {
      cy.mount(TestComponent).then(({ component }) => {
        component.modelValue = component.options[1];
        selectedItem().invoke('text').should('equal', component.options[1].label);
      });
    });
  });
});
