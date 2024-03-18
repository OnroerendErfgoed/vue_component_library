/* eslint-disable vue/one-component-per-file */
import FilterInput from '../components/dumb/FilterInput.vue';
import { defineComponent, ref } from 'vue';
import { FilterDatepicker, FilterGemeente, FilterRadio, FilterSelect, FilterText } from '@components/index';
import type { IFilter, IFilterOption } from '@models/filter-input';

describe('FilterInput', () => {
  const TestComponent = defineComponent({
    components: { FilterInput },
    setup() {
      const options = ref<IFilterOption>();
      return { options };
    },
    template: '<filter-input :options="options"></filter-input>',
  });

  it('renders a message when no options are given', () => {
    cy.mount(TestComponent);
    cy.dataCy('no-options').should('exist').invoke('text').should('equal', 'Geen filteropties geconfigureerd');
  });

  describe('with options', () => {
    const TestComponentWithOptions = defineComponent({
      components: { FilterInput, FilterText, FilterDatepicker, FilterGemeente, FilterRadio, FilterSelect },
      setup() {
        const options: IFilterOption[] = [
          {
            label: 'ID',
            key: 'id',
          },
          {
            label: 'Type plan',
            key: 'plantype',
          },
          {
            label: 'Gemeente',
            key: 'gemeente',
          },
          {
            label: 'Datum goedkeuring vanaf',
            key: 'datum_goedkeuring_van',
          },
          {
            label: 'Beheerscommissie',
            key: 'beheerscommissie',
          },
        ];
        const filters = ref<IFilter[]>([]);
        const setFilters = (f: IFilter[]) => (filters.value = f);
        return { options, filters, setFilters };
      },
      template: `
      <filter-input v-slot="{ value, setValue, selectedOption, addFilter }" :options="options" @filters-selected="setFilters">
        <filter-text v-if="selectedOption.key === 'id'" :value="value" @update:value="setValue($event, $event)" placeholder="ID" @keyup.enter="addFilter"></filter-text>
        <filter-datepicker v-if="selectedOption.key === 'datum_goedkeuring_van'" :value="value" @update:value="setValue($event, $event[0])"></filter-datepicker>
        <filter-gemeente v-if="selectedOption.key === 'gemeente'" :value="value" @update:value="setValue($event, $event.naam)"></filter-gemeente>
        <filter-radio v-if="selectedOption.key === 'beheerscommissie' || selectedOption.key === 'beheersplan_verlopen'" :options="radioOptions" :value="value" @update:value="setValue($event, $event)"></filter-radio>
        <filter-select v-if="selectedOption.key === 'plantype'" placeholder="Type plan" :model-value="value" @update:model-value="setValue($event, $event)">
          <optgroup label="Niet Actief">
            <option value="klad">Klad</option>
            <option value="kladzonderfoto">Klad zonder foto</option>
          </optgroup>
          <optgroup label="Actief">
            <option value="actief">Actief</option>
          </optgroup>
        </filter-select>
      </filter-input>
      `,
    });

    it('renders a select with given options', () => {
      cy.mount(TestComponentWithOptions).then(({ component }) => {
        cy.dataCy('filter-select')
          .should('exist')
          .children()
          .should('have.length', 5)
          .each((option, i) => {
            expect(option.text()).to.equal(component.options[i].label);
          });
      });
    });

    describe('adding filters', () => {
      beforeEach(() => {
        cy.mount(TestComponentWithOptions);

        cy.dataCy('filter-select').select('ID');
        cy.dataCy('filter-text').should('exist').type('filtertext');
        cy.dataCy('filter-add-button').click();

        cy.dataCy('filter-select').select('Datum goedkeuring vanaf');
        cy.dataCy('filter-datepicker').parent().find('.vl-datepicker__input-field').should('exist').type('16-02-1996');
        cy.dataCy('filter-add-button').click();
      });

      it('has a filters label', () => {
        cy.dataCy('filters-label').should('exist').invoke('text').should('equal', 'Filters:');
      });

      it('clears the input field after filter was added', () => {
        cy.get('.vl-input-field ').should('have.value', '');
      });

      it('disables the filter add button if the input field is empty', () => {
        cy.dataCy('filter-add-button').should('be.disabled');
      });

      it('lists the added filters as pill elements', () => {
        cy.dataCy('filter-id-filtertext').should('exist').invoke('text').should('equal', 'ID / filtertext');
        cy.dataCy('filter-datum_goedkeuring_van-1996-02-16')
          .should('exist')
          .invoke('text')
          .should('equal', 'Datum goedkeuring vanaf / 1996-02-16');
      });

      describe('clearing filters', () => {
        it('has a clear all filters button', () => {
          cy.dataCy('clear-filter-button').should('exist');
        });

        it('clears all filters clicking on the clear filters button', () => {
          cy.dataCy('clear-filter-button').click();
          cy.dataCy('clear-filter-button').should('not.exist');

          cy.dataCy('filter-id-filtertext').should('not.exist');
          cy.dataCy('filter-datum_goedkeuring_van-16-02-1996').should('not.exist');
        });

        it('removes a filter individually when clicking on the x of a filter', () => {
          cy.dataCy('filter-id-filtertext').find('.vl-pill__close').click();

          cy.dataCy('filter-id-filtertext').should('not.exist');
          cy.dataCy('filter-datum_goedkeuring_van-1996-02-16')
            .should('exist')
            .invoke('text')
            .should('equal', 'Datum goedkeuring vanaf / 1996-02-16');
        });
      });
    });

    describe('exposed helper methods', () => {
      it('allows adding filters', () => {
        cy.mount(TestComponentWithOptions);

        cy.dataCy('filter-select').select('ID');
        cy.dataCy('filter-text').should('exist').type('filtertext').type('{enter}');

        cy.dataCy('filter-id-filtertext').should('exist').invoke('text').should('equal', 'ID / filtertext');
      });
    });

    describe('events', () => {
      it('emits a "filters-selected" event when a filter was added', () => {
        const onFiltersSelectedSpy = cy.spy().as('onFiltersSelectedSpy');
        cy.mount(TestComponentWithOptions, { props: { onFiltersSelected: onFiltersSelectedSpy } }).then(
          ({ component }) => {
            cy.dataCy('filter-select').select('ID');
            cy.dataCy('filter-text').should('exist').type('filtertext');
            cy.dataCy('filter-add-button')
              .click()
              .then(() => {
                expect(component.filters[0].key).to.equal('id');
                expect(component.filters[0].value.value).to.equal('filtertext');
                cy.get('@onFiltersSelectedSpy').should('have.been.calledWith', component.filters);
              });
          }
        );
      });

      it('emits a "filters-selected" event when a filter was removed', () => {
        const onFiltersSelectedSpy = cy.spy().as('onFiltersSelectedSpy');
        cy.mount(TestComponentWithOptions, { props: { onFiltersSelected: onFiltersSelectedSpy } }).then(() => {
          cy.dataCy('filter-select').select('ID');
          cy.dataCy('filter-text').should('exist').type('filtertext');
          cy.dataCy('filter-add-button')
            .click()
            .then(() => {
              cy.dataCy('filter-id-filtertext').find('.vl-pill__close').click();
              cy.get('@onFiltersSelectedSpy').should('have.been.calledWith', []);
            });
        });
      });

      it('emits a "filters-selected" event when all filters were cleaned', () => {
        const onFiltersSelectedSpy = cy.spy().as('onFiltersSelectedSpy');
        cy.mount(TestComponentWithOptions, { props: { onFiltersSelected: onFiltersSelectedSpy } }).then(() => {
          cy.dataCy('filter-select').select('ID');
          cy.dataCy('filter-text').should('exist').type('filtertext');
          cy.dataCy('filter-add-button')
            .click()
            .then(() => {
              cy.dataCy('filter-select').select('ID');
              cy.dataCy('filter-text').should('exist').type('anothertext');
              cy.dataCy('filter-add-button')
                .click()
                .then(() => {
                  cy.dataCy('clear-filter-button')
                    .click()
                    .then(() => {
                      cy.get('@onFiltersSelectedSpy').should('have.been.calledWith', []);
                    });
                });
            });
        });
      });
    });
  });
});
