/* eslint-disable vue/one-component-per-file */
import FilterSelect from '../components/forms/dumb/OeFilterSelect.vue';
import { defineComponent, ref } from 'vue';
import type { IOption } from '@components/forms/models/filter';

describe('FilterSelect', () => {
  describe('default', () => {
    const TestComponent = defineComponent({
      components: { FilterSelect },
      setup() {
        const selectValue = ref('');
        const options: IOption[] = [
          {
            label: 'Ja',
            value: 'ja',
          },
          {
            label: 'Nee',
            value: 'nee',
          },
        ];
        return { selectValue, options };
      },
      template:
        '<filter-select :options="options" :value="selectValue" @update:model-value="$event => selectValue=$event"/>',
    });

    it('renders a select option for each option', () => {
      cy.mount(TestComponent).then(({ component }) => {
        cy.dataCy('filter-select')
          .children()
          .should('have.length', '2')
          .each((option, i) => {
            expect(option.text()).to.equal(component.options[i].label);
            expect(option.attr('value')).to.equal(component.options[i].value);
          });
      });
    });

    it('accepts a value prop', () => {
      cy.mount(TestComponent).then(({ component }) => {
        component.selectValue = 'ja';
        cy.dataCy('filter-select').find('#option-ja').should('be.selected');
        cy.dataCy('filter-select').find('#option-nee').should('not.be.selected');
      });
    });

    it('emits an update:value event', () => {
      cy.mount(TestComponent).then(({ component }) => {
        cy.dataCy('filter-select')
          .select('ja')
          .then(() => {
            expect(component.selectValue).to.equal('ja');
          });
      });
    });

    it('renders a placeholder', () => {
      const TestComponentWithPlaceholder = defineComponent({
        components: { FilterSelect },
        template: '<filter-select placeholder="Select a value"/>',
      });
      cy.mount(TestComponentWithPlaceholder);
      cy.dataCy('filter-select').children().first().invoke('text').should('equal', 'Select a value');
    });
  });

  describe('with slot', () => {
    const TestComponent = defineComponent({
      components: { FilterSelect },
      setup() {
        const selectValue = ref('');
        return { selectValue };
      },
      template: `<filter-select :model-value="selectValue" @update:model-value="$event => selectValue=$event">
                  <optgroup label="Niet Actief">
                    <option value="klad">Klad</option>
                    <option id="option-kladzonderfoto" value="kladzonderfoto">Klad zonder foto</option>
                    </optgroup>
                  <optgroup label="Actief">
                    <option value="actief">Actief</option>
                  </optgroup>
                </filter-select>`,
    });

    it('renders the given body', () => {
      cy.mount(TestComponent).then(() => {
        cy.dataCy('filter-select')
          .children()
          .should('have.length', '2')
          .first()
          .should('have.attr', 'label', 'Niet Actief')
          .children()
          .should('have.length', 2);
        cy.dataCy('filter-select')
          .children()
          .last()
          .should('have.attr', 'label', 'Actief')
          .children()
          .should('have.length', 1);
      });
    });

    it('accepts a value prop', () => {
      cy.mount(TestComponent).then(({ component }) => {
        component.selectValue = 'kladzonderfoto';
        cy.dataCy('filter-select').find('#option-kladzonderfoto').should('be.selected');
      });
    });

    it('emits an update:value event', () => {
      cy.mount(TestComponent).then(({ component }) => {
        cy.dataCy('filter-select')
          .select('kladzonderfoto')
          .then(() => {
            expect(component.selectValue).to.equal('kladzonderfoto');
          });
      });
    });
  });
});
