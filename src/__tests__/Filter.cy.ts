/* eslint-disable vue/one-component-per-file */
import { defineComponent, ref } from 'vue';
import {
  IFilter,
  IFilterOption,
  OeFilter,
  OeFilterDatepicker,
  OeFilterGemeente,
  OeFilterRadio,
  OeFilterSelect,
  OeFilterText,
} from '@/forms';

describe('Filter', () => {
  const TestComponent = defineComponent({
    components: { OeFilter },
    setup() {
      const options = ref<IFilterOption>();
      return { options };
    },
    template: '<OeFilter :options="options"></OeFilter>',
  });

  it('renders a message when no options are given', () => {
    cy.mount(TestComponent);
    cy.dataCy('no-options').should('exist').invoke('text').should('equal', 'Geen filteropties geconfigureerd');
  });

  describe('with options', () => {
    const TestComponentWithOptions = defineComponent({
      components: { OeFilterText, OeFilterDatepicker, OeFilterGemeente, OeFilterRadio, OeFilterSelect },
      props: {
        uniqueFilters: {
          type: Boolean,
          default: false,
        },
      },
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
        const selectedOption = ref<IFilterOption>(options[0]); // Initialize with the first option
        const setFilters = (f: IFilter[]) => (filters.value = f);
        return { options, filters, selectedOption, setFilters };
      },
      template: `
      <OeFilter v-slot="{ value, setValue, selectedOption, addFilter }" :options="options" :unique-filters="uniqueFilters" @filters-selected="setFilters">
        <OeFilterText v-if="selectedOption.key === 'id'" :value="value" @update:value="setValue($event, $event)" placeholder="ID" @keyup.enter="addFilter"></OeFilterText>
        <OeFilterDatepicker v-if="selectedOption.key === 'datum_goedkeuring_van'" :value="value" @update:value="setValue($event, $event)"></OeFilterDatepicker>
        <OeFilterGemeente v-if="selectedOption.key === 'gemeente'" :value="value" @update:value="setValue($event, $event.naam)"></OeFilterGemeente>
        <OeFilterRadio v-if="selectedOption.key === 'beheerscommissie' || selectedOption.key === 'beheersplan_verlopen'" :options="radioOptions" :value="value" @update:value="setValue($event, $event)"></OeFilterRadio>
        <OeFilterSelect v-if="selectedOption.key === 'plantype'" placeholder="Type plan" :model-value="value" @update:model-value="setValue($event, $event)">
          <optgroup label="Niet Actief">
            <option value="klad">Klad</option>
            <option value="kladzonderfoto">Klad zonder foto</option>
          </optgroup>
          <optgroup label="Actief">
            <option value="actief">Actief</option>
          </optgroup>
        </OeFilterSelect>
      </OeFilter>
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

      it('clears the input field after filter was added', () => {
        cy.get('.vl-input-field ').last().should('have.value', '');
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

    describe('unique filters behavior', () => {
      it('replaces existing filter with same key when uniqueFilters is true', () => {
        cy.mount(TestComponentWithOptions, { props: { uniqueFilters: true } });

        cy.dataCy('filter-select').select('ID');
        cy.dataCy('filter-text').type('firstValue');
        cy.dataCy('filter-add-button').click();

        cy.dataCy('filter-select').select('ID');
        cy.dataCy('filter-text').type('secondValue');
        cy.dataCy('filter-add-button').click();

        cy.get('.vl-pill').should('have.length', 1);
        cy.dataCy('filter-id-firstValue').should('not.exist');
        cy.dataCy('filter-id-secondValue').should('exist');
      });

      it('allows multiple filters with same key when uniqueFilters is false', () => {
        cy.mount(TestComponentWithOptions, { props: { uniqueFilters: false } });

        cy.dataCy('filter-select').select('ID');
        cy.dataCy('filter-text').type('firstValue');
        cy.dataCy('filter-add-button').click();

        cy.dataCy('filter-select').select('ID');
        cy.dataCy('filter-text').type('secondValue');
        cy.dataCy('filter-add-button').click();

        cy.get('.vl-pill').should('have.length', 2);
        cy.dataCy('filter-id-firstValue').should('exist');
        cy.dataCy('filter-id-secondValue').should('exist');
      });
    });
  });

  describe('responsive behavior', () => {
    const TestComponentWithOptions = defineComponent({
      components: { OeFilter, OeFilterText, OeFilterDatepicker, OeFilterGemeente, OeFilterRadio, OeFilterSelect },
      setup() {
        const options: IFilterOption[] = [
          { label: 'ID', key: 'id' },
          { label: 'Type plan', key: 'plantype' },
          { label: 'Gemeente', key: 'gemeente' },
          { label: 'Datum goedkeuring vanaf', key: 'datum_goedkeuring_van' },
          { label: 'Beheerscommissie', key: 'beheerscommissie' },
        ];
        const filters = ref<IFilter[]>([]);
        const selectedOption = ref<IFilterOption>(options[0]); // Initialize with the first option
        return { options, filters, selectedOption };
      },
      template: `
        <OeFilter :options="options" @filters-selected="setFilters">
          <OeFilterText v-if="selectedOption.key === 'id'" :value="value" @update:value="setValue($event, $event)" placeholder="ID"></OeFilterText>
          <OeFilterDatepicker v-if="selectedOption.key === 'datum_goedkeuring_van'" :value="value" @update:value="setValue($event, $event)"></OeFilterDatepicker>
          <OeFilterGemeente v-if="selectedOption.key === 'gemeente'" :value="value" @update:value="setValue($event, $event.naam)"></OeFilterGemeente>
          <OeFilterRadio v-if="selectedOption.key === 'beheerscommissie'" :options="radioOptions" :value="value" @update:value="setValue($event, $event)"></OeFilterRadio>
          <OeFilterSelect v-if="selectedOption.key === 'plantype'" placeholder="Type plan" :model-value="value" @update:model-value="setValue($event, $event)">
            <optgroup label="Niet Actief">
              <option value="klad">Klad</option>
              <option value="kladzonderfoto">Klad zonder foto</option>
            </optgroup>
            <optgroup label="Actief">
              <option value="actief">Actief</option>
            </optgroup>
          </OeFilterSelect>
        </OeFilter>
      `,
    });

    it('takes full width on small containers', () => {
      cy.mount(TestComponentWithOptions).then(() => {
        cy.viewport(400, 600); // Simulate a small container
        cy.get('.filters-input').should('have.css', 'width', 400 * 1 + 'px');
      });
    });

    it('stacks columns vertically on very small containers', () => {
      cy.mount(TestComponentWithOptions).then(() => {
        cy.viewport(300, 600); // Simulate a very small container
        cy.get('.filters-input').should('have.css', 'flex-direction', 'column');
      });
    });

    it('displays filters-input with 67% width on medium containers', () => {
      cy.mount(TestComponentWithOptions).then(() => {
        cy.viewport(800, 600); // Simulate a medium container
        cy.get('.filters-input').should('have.css', 'width', 800 * 0.67 + 'px');
      });
    });

    it('displays filters-input with 50% width on large containers', () => {
      cy.mount(TestComponentWithOptions).then(() => {
        cy.viewport(1200, 600); // Simulate a large container
        cy.get('.filters-input').should('have.css', 'width', 1200 * 0.5 + 'px');
      });
    });

    it('maintains responsive behavior when resizing', () => {
      cy.mount(TestComponentWithOptions).then(() => {
        cy.viewport(1200, 600); // Start with a large container
        cy.get('.filters-input').should('have.css', 'width', 1200 * 0.5 + 'px');

        cy.viewport(800, 600); // Resize to medium container
        cy.get('.filters-input').should('have.css', 'width', 800 * 0.67 + 'px');

        cy.viewport(400, 600); // Resize to small container
        cy.get('.filters-input').should('have.css', 'width', 400 * 1 + 'px');

        cy.viewport(300, 600); // Resize to very small container
        cy.get('.filters-input').should('have.css', 'flex-direction', 'column');
      });
    });
  });
});
