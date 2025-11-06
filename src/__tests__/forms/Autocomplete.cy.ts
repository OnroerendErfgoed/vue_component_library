/* eslint-disable vue/one-component-per-file */
import { defineComponent, ref } from 'vue';
import OeButton from '@components/core/dumb/OeButton.vue';
import { OeAutocomplete } from '@components/forms';
import type { IAutocompleteOption } from '@components/forms/models/autocomplete';

describe('Autocomplete', () => {
  describe('default', () => {
    const TestComponent = defineComponent({
      components: { OeAutocomplete },
      template: '<OeAutocomplete id="test" custom-attr/>',
    });

    it('renders an input field with placeholder', () => {
      cy.mount(TestComponent);

      cy.dataCy('autocomplete')
        .should('exist')
        .should('be.visible')
        .find('input')
        .should('have.attr', 'placeholder', 'Type om te zoeken...');
    });

    it('assigns a unique id based on the given property', () => {
      cy.mount(TestComponent);

      cy.dataCy('autocomplete').should('have.id', 'autocomplete-test');
    });

    it('does not open a dropdown with options after entering less than 3 characters', () => {
      cy.mount(TestComponent);

      cy.dataCy('autocomplete').type('te').find('.vl-autocomplete__list-wrapper').should('not.exist');
    });

    it('opens a dropdown with options after entering 3 characters', () => {
      cy.mount(TestComponent);

      cy.dataCy('autocomplete')
        .type('tes')
        .find('.vl-autocomplete__list-wrapper')
        .should('exist')
        .find('.vl-autocomplete__list')
        .should('exist')
        .find('.vl-autocomplete__cta')
        .should('exist')
        .should('have.length', 1)
        .invoke('text')
        .should('equal', 'tes');
    });

    it('closes the dropdown when clicking outside the component', () => {
      cy.mount(TestComponent);

      cy.dataCy('autocomplete').type('tes');
      cy.dataCy('result').should('exist');

      // trigger click outside event
      cy.get('html').click(0, 100);

      cy.dataCy('result').should('not.exist');
    });

    it('selects an option after clicking on it and emits an event for the updated value', () => {
      const onUpdateValueSpy = cy.spy().as('onUpdateValue');

      cy.mount(TestComponent, { props: { 'onUpdate:value': onUpdateValueSpy } });

      cy.dataCy('autocomplete').type('tes').find('.vl-autocomplete__cta').click();
      cy.dataCy('autocomplete').find('.vl-autocomplete__list-wrapper').should('not.exist');

      cy.get('@onUpdateValue').should('have.been.calledWith', { title: 'tes' });
    });

    it('clears an option after clearing the entire field and emits an event for the updated value', () => {
      const onUpdateValueSpy = cy.spy().as('onUpdateValue');

      cy.mount(TestComponent, { props: { 'onUpdate:value': onUpdateValueSpy } });

      cy.dataCy('autocomplete').type('tes').find('.vl-autocomplete__cta').click();
      cy.dataCy('autocomplete').find('.vl-autocomplete__list-wrapper').should('not.exist');
      cy.dataCy('autocomplete').find('input').clear();

      cy.get('@onUpdateValue').should('have.been.calledWith', { title: '', value: '' });
    });

    it('applies fallthrough attributes to the input element', () => {
      cy.mount(TestComponent);
      cy.dataCy('autocomplete-input').should('have.attr', 'custom-attr');
    });
  });

  describe('Initial value', () => {
    const TestComponent = defineComponent({
      components: { OeAutocomplete, OeButton },
      setup() {
        const callback = (searchTerm: string): Promise<IAutocompleteOption[]> => {
          return new Promise(function (resolve) {
            // Fake delay to show the loader
            setTimeout(() => {
              resolve(
                [
                  {
                    title: 'dummy',
                  },
                  {
                    title: 'random',
                  },
                ].filter((item) => item.title.includes(searchTerm))
              );
            }, 1000);
          });
        };
        const value = ref({
          title: 'dummy',
        });
        const resetValue = () => {
          value.value = { title: '' };
        };

        return {
          value,
          callback,
          resetValue,
        };
      },
      template:
        '<OeAutocomplete id="test" :callbackFn="callback" :value="value"/><VlButton id="reset-button" class="vl-u-spacer-top" @click="resetValue">Reset value</VlButton>',
    });

    it('sets the initial value correctly', () => {
      cy.mount(TestComponent);
      cy.dataCy('autocomplete').find('input').should('have.value', 'dummy');
    });

    it('clears the value when the passed in value title is empty', () => {
      cy.mount(TestComponent);
      cy.get('#reset-button').click();
      cy.dataCy('autocomplete').find('input').should('have.value', '');
    });
  });

  describe('Custom callback', () => {
    const TestComponent = defineComponent({
      components: { OeAutocomplete },
      setup() {
        const callback = (searchTerm: string): Promise<IAutocompleteOption[]> => {
          return new Promise(function (resolve) {
            // Fake delay to show the loader
            setTimeout(() => {
              resolve(
                [
                  {
                    title: 'dummy',
                  },
                  {
                    title: 'random',
                  },
                ].filter((item) => item.title.includes(searchTerm))
              );
            }, 1000);
          });
        };
        return {
          callback,
        };
      },
      template: '<OeAutocomplete id="test" :callbackFn="callback"/>',
    });

    it('shows a loader while callback is pending', () => {
      cy.mount(TestComponent);

      cy.dataCy('autocomplete').type('dum');
      cy.dataCy('loader').should('exist');
      cy.dataCy('loader-message').should('exist').invoke('text').should('equal', 'Resultaten worden opgehaald...');
      cy.wait(1000);
      cy.dataCy('loader').should('not.exist');
      cy.dataCy('loader-message').should('not.exist');
    });

    it('shows a message when searchterm does not match any callback result', () => {
      cy.mount(TestComponent);

      cy.dataCy('autocomplete').type('test');
      cy.wait(1000);

      cy.dataCy('no-results').should('exist');
      cy.dataCy('no-results')
        .find('.vl-autocomplete__cta__title')
        .should('exist')
        .invoke('text')
        .should('equal', 'Geen resultaten gevonden');
      cy.dataCy('no-results')
        .find('.vl-autocomplete__cta__sub')
        .should('exist')
        .invoke('text')
        .should('equal', 'Doe een nieuwe zoekopdracht');
    });

    it('uses the callback again after selecting an option', () => {
      cy.mount(TestComponent);

      cy.dataCy('autocomplete').type('dummy').wait(1000).find('.vl-autocomplete__cta').click();
      cy.dataCy('autocomplete-input').clear();

      cy.dataCy('autocomplete')
        .type('rand')
        .wait(1000)
        .find('.vl-autocomplete__list-wrapper')
        .should('exist')
        .find('.vl-autocomplete__list')
        .should('exist')
        .find('.vl-autocomplete__cta')
        .should('exist')
        .should('have.length', 1)
        .invoke('text')
        .should('equal', 'random');
    });
  });

  describe('Autoselect', () => {
    const TestComponent = defineComponent({
      components: { OeAutocomplete },
      setup() {
        const callback = (searchTerm: string): Promise<IAutocompleteOption[]> => {
          return Promise.resolve(
            [
              {
                title: 'dummy',
              },
            ].filter((item) => item.title.includes(searchTerm))
          );
        };
        return {
          callback,
        };
      },
      template: '<OeAutocomplete id="test" :callbackFn="callback" autoselect/>',
    });

    it('selects the option automatically when there is only 1 result', () => {
      const onUpdateValueSpy = cy.spy().as('onUpdateValue');

      cy.mount(TestComponent, { props: { 'onUpdate:value': onUpdateValueSpy } });

      cy.dataCy('autocomplete').type('dum');

      cy.get('@onUpdateValue').should('have.been.calledWith', { title: 'dummy' });
    });

    it('does not select the option automatically when there is only 1 result and backspace is used', () => {
      const onUpdateValueSpy = cy.spy().as('onUpdateValue');

      cy.mount(TestComponent, { props: { 'onUpdate:value': onUpdateValueSpy } });

      cy.dataCy('autocomplete').type('dum');
      cy.get('@onUpdateValue').should('have.been.calledWith', { title: 'dummy' });

      cy.dataCy('autocomplete').type('{backspace}');
      cy.dataCy('autocomplete').find('input').should('have.value', 'dumm');
    });
  });

  describe('Minimum characters', () => {
    const TestComponent = defineComponent({
      components: { OeAutocomplete },
      setup() {
        const callback = (searchTerm: string): Promise<IAutocompleteOption[]> => {
          return Promise.resolve(
            [
              {
                title: 'minimal5chars',
              },
            ].filter((item) => item.title.includes(searchTerm))
          );
        };
        return {
          callback,
        };
      },
      template: '<OeAutocomplete id="test" :callbackFn="callback" :min-chars="5"/>',
    });

    it('does not search when the minimum amount of characters is not reached', () => {
      cy.mount(TestComponent);
      cy.dataCy('autocomplete').type('min');

      cy.dataCy('result').should('not.exist');

      cy.dataCy('autocomplete').type('im');
      cy.dataCy('result').should('be.exist');
    });
  });

  describe('Allow free text', () => {
    const TestComponent = defineComponent({
      components: { OeAutocomplete },
      setup() {
        const callback = (searchTerm: string): Promise<IAutocompleteOption[]> => {
          return Promise.resolve(
            [
              {
                title: 'minimal5chars',
              },
            ].filter((item) => item.title.includes(searchTerm))
          );
        };
        return {
          callback,
        };
      },
      template: '<OeAutocomplete id="test" :callbackFn="callback" :min-chars="3" allow-free-text/>',
    });

    it('selects the freetext input when no options were found', () => {
      const onUpdateValueSpy = cy.spy().as('onUpdateValueSpy');

      cy.mount(TestComponent, { props: { 'onUpdate:value': onUpdateValueSpy } }).then(() => {
        cy.dataCy('autocomplete').type('freetext');
        cy.dataCy('result').should('not.exist');

        cy.get('@onUpdateValueSpy').should('have.been.calledWith', { title: 'freetext', value: 'freetext' });
      });
    });
  });
});
