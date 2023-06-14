import { defineComponent, ref } from 'vue';
import FilterRadio from '../components/dumb/FilterRadio.vue';
import type { IOption } from '@models/filter-input';

describe('FilterRadio', () => {
  const TestComponent = defineComponent({
    components: { FilterRadio },
    setup() {
      const radioValue = ref('');
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
      return { radioValue, options };
    },
    template: '<filter-radio :options="options" :value="radioValue" @update:value="$event => radioValue=$event"/>',
  });

  it('renders a radio for each option', () => {
    cy.mount(TestComponent).then(({ component }) => {
      cy.dataCy('filter-radio')
        .children()
        .should('have.length', '2')
        .each((radio, i) => {
          expect(radio.text()).to.equal(component.options[i].label);
          expect(radio.find('input').attr('value')).to.equal(component.options[i].value);
        });
    });
  });

  it('accepts a value prop', () => {
    cy.mount(TestComponent).then(({ component }) => {
      component.radioValue = 'ja';
      cy.dataCy('filter-radio').find('#radio-ja').should('be.checked');
      cy.dataCy('filter-radio').find('#radio-nee').should('not.be.checked');
    });
  });

  it('emits an update:value event', () => {
    cy.mount(TestComponent).then(({ component }) => {
      cy.dataCy('filter-radio')
        .find('#radio-ja')
        .click({ force: true })
        .then(() => {
          expect(component.radioValue).to.equal('ja');
        });
    });
  });
});
