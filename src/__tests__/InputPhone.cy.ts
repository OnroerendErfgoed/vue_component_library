import type { CountryCode } from 'libphonenumber-js';
import { defineComponent, ref } from 'vue';
import InputPhone from '@components/dumb/InputPhone.vue';

const TestComponent = defineComponent({
  components: { InputPhone },
  setup() {
    const phoneNumber = ref('');
    return { phoneNumber: phoneNumber };
  },
  template: '<input-phone id="id" v-model="phoneNumber"/>',
});

const generateTestSuiteNonDefaultCountry = (
  countryCode: CountryCode,
  phonePlaceholder: string,
  phonePrefix: string,
  expectedInput: string
) => {
  describe(countryCode, () => {
    const phoneInput = phonePlaceholder.replace(/\s/g, '');
    const internationalFormat = `${phonePrefix}${expectedInput}`;
    const randomInput = '15484184181595599';

    it('renders a placeholder according to selected country', () => {
      cy.mount(TestComponent);
      changeCountryCode(countryCode);

      cy.dataCy('input-phone').should('have.attr', 'placeholder', phonePlaceholder);
    });

    it('accepts a phone number without leading country code when country code is selected and formats accordingly', () => {
      cy.mount(TestComponent);
      changeCountryCode(countryCode);

      cy.dataCy('input-phone').type(phoneInput);

      checkFlagAndPrefix(countryCode, phonePrefix);
      checkPhoneNumberInput(expectedInput);
    });

    it('accepts a phone number with leading country code, automatically derives country code and formats accordingly', () => {
      cy.mount(TestComponent);

      cy.dataCy('input-phone').type(internationalFormat);

      checkFlagAndPrefix(countryCode, phonePrefix);
      checkPhoneNumberInput(expectedInput);
    });

    it('accepts a value prop and sets the country code and phone number', () => {
      cy.mount(TestComponent).then(({ component }) => {
        component.phoneNumber = internationalFormat;

        checkFlagAndPrefix(countryCode, phonePrefix);
        checkPhoneNumberInput(expectedInput);
      });
    });

    it('emits an update:modelValue event', () => {
      const onUpdateModelValueSpy = cy.spy().as('onUpdateModelValueSpy');
      cy.mount(TestComponent, { props: { 'onUpdate:modelValue': onUpdateModelValueSpy } }).then(({ component }) => {
        changeCountryCode(countryCode);
        cy.dataCy('input-phone')
          .type(phoneInput)
          .then(() => {
            expect(component.phoneNumber).to.equal(internationalFormat);
            cy.get('@onUpdateModelValueSpy').should('have.been.calledWith', internationalFormat);
          });
      });
    });

    it('marks the field as invalid when an invalid phone number is entered for the selected country code and does not emit an update:modelValue event', () => {
      const onUpdateModelValueSpy = cy.spy().as('onUpdateModelValueSpy');
      cy.mount(TestComponent, { props: { 'onUpdate:modelValue': onUpdateModelValueSpy } }).then(() => {
        changeCountryCode(countryCode);
        cy.dataCy('input-phone')
          .type(randomInput)
          .then(() => {
            cy.get('@onUpdateModelValueSpy').should('not.have.been.calledWith', randomInput);
            checkError(phonePlaceholder);
          });
      });
    });

    it('clears the phone number when the country code is changed', () => {
      cy.mount(TestComponent).then(({ component }) => {
        component.phoneNumber = internationalFormat;

        checkFlagAndPrefix(countryCode, phonePrefix);
        checkPhoneNumberInput(expectedInput);

        changeCountryCode('be');
        checkPhoneNumberInput('');
      });
    });
  });
};

describe('InputPhone', () => {
  it('renders', () => {
    cy.mount(TestComponent);
  });

  it('sets default prefix classes', () => {
    cy.mount(TestComponent);
    cy.dataCy('prefix').should('have.class', 'vl-col--1-6 vl-col--2-6--m vl-col--3-6--xs');
  });

  it('sets default input field classes', () => {
    cy.mount(TestComponent);
    cy.dataCy('input-phone').should('have.class', 'vl-col--5-6 vl-col--4-6--m vl-col--3-6--xs');
  });

  it('sets configured prefix classes', () => {
    cy.mount(TestComponent, {
      props: {
        prefixClass: 'test',
      },
    });
    cy.dataCy('prefix').should('have.class', 'test');
  });

  it('sets configured input field classes', () => {
    cy.mount(TestComponent, {
      props: {
        inputFieldClass: 'test',
      },
    });
    cy.dataCy('input-phone').should('have.class', 'test');
  });

  describe('BE', () => {
    it('renders a placeholder according to selected country', () => {
      cy.mount(TestComponent);
      cy.dataCy('input-phone').should('have.attr', 'placeholder', '0470 12 34 56');
    });

    it('accepts a phone number with leading 0 and formats accordingly', () => {
      cy.mount(TestComponent);
      cy.dataCy('input-phone').type('0497668811');
      checkFlagAndPrefix('be', '+32');
      checkPhoneNumberInput('497668811');
    });

    it('accepts a phone number with leading country code, sets country code and formats accordingly', () => {
      cy.mount(TestComponent);
      cy.dataCy('input-phone').type('+32497668811');
      checkFlagAndPrefix('be', '+32');
      checkPhoneNumberInput('497668811');
    });

    it('accepts a value prop and sets the country code and phone number', () => {
      cy.mount(TestComponent).then(({ component }) => {
        component.phoneNumber = '+32497668811';

        checkFlagAndPrefix('be', '+32');
        checkPhoneNumberInput('497668811');
      });
    });

    it('emits an update:modelValue event', () => {
      const onUpdateModelValueSpy = cy.spy().as('onUpdateModelValueSpy');
      cy.mount(TestComponent, { props: { 'onUpdate:modelValue': onUpdateModelValueSpy } }).then(({ component }) => {
        cy.dataCy('input-phone')
          .type('0497668811')
          .then(() => {
            expect(component.phoneNumber).to.equal('+32497668811');
            cy.get('@onUpdateModelValueSpy').should('have.been.calledWith', '+32497668811');
          });
      });
    });

    it('marks the field as invalid when an invalid phone number is entered for the selected country code and does not emit an update:modelValue event', () => {
      const onUpdateModelValueSpy = cy.spy().as('onUpdateModelValueSpy');
      cy.mount(TestComponent, { props: { 'onUpdate:modelValue': onUpdateModelValueSpy } }).then(() => {
        cy.dataCy('input-phone')
          .type('15484184181')
          .then(() => {
            cy.get('@onUpdateModelValueSpy').should('not.have.been.calledWith', '15484184181');
            checkError('0470 12 34 56');
          });
      });
    });

    it('clears the phone number when the country code is changed', () => {
      cy.mount(TestComponent).then(({ component }) => {
        component.phoneNumber = '+32497668811';

        checkFlagAndPrefix('be', '+32');
        checkPhoneNumberInput('497668811');

        changeCountryCode('de');
        checkPhoneNumberInput('');
      });
    });
  });

  generateTestSuiteNonDefaultCountry('DE', '01512 3456789', '+49', '15123456789');
  generateTestSuiteNonDefaultCountry('FR', '06 12 34 56 78', '+33', '612345678');
  generateTestSuiteNonDefaultCountry('GB', '07400 123456', '+44', '7400123456');
  generateTestSuiteNonDefaultCountry('NL', '06 12345678', '+31', '612345678');
  generateTestSuiteNonDefaultCountry('LU', '628 123 456', '+352', '628123456');
});

const checkFlagAndPrefix = (countryCode: string, prefix: string) => {
  cy.dataCy('country-code')
    .find('.multiselect__single span')
    .should('have.class', 'flag')
    .should('have.class', countryCode.toLowerCase())
    .invoke('text')
    .should('equal', prefix);
};

const checkPhoneNumberInput = (phoneNumber: string) => {
  cy.dataCy('input-phone').should('have.value', phoneNumber);
};

const checkError = (expectedFormat: string) => {
  cy.dataCy('input-phone').blur();
  cy.dataCy('input-phone').should('have.class', 'vl-input-field--error');
  cy.dataCy('input-error')
    .should('exist')
    .invoke('text')
    .should('equal', `Ongeldige waarde, gebruik formaat vb. ${expectedFormat}`);
};

const changeCountryCode = (countryCode: string) => {
  cy.dataCy('country-code').click().find(`.flag.${countryCode.toLowerCase()}`).click();
};
