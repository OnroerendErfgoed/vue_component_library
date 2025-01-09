/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//

Cypress.Commands.add('dataCy', (name: string) => {
  cy.get(`[data-cy="${name}"]`);
});

Cypress.Commands.add('mockAdressenregister', () => {
  // Landen
  cy.intercept('GET', 'https://test-geo.onroerenderfgoed.be/adressenregister/landen', { fixture: 'landen.json' }).as(
    'dataGetLanden'
  );

  // Gewesten
  cy.intercept('GET', 'https://test-geo.onroerenderfgoed.be/adressenregister/gewesten', {
    fixture: 'gewesten.json',
  }).as('dataGetGewesten');

  // Provincies
  cy.intercept('GET', 'https://test-geo.onroerenderfgoed.be/adressenregister/gewesten/2000/provincies', {
    fixture: 'provinciesVlaamsGewest.json',
  }).as('dataGetProvinciesVlaamsGewest');
  cy.intercept('GET', 'https://test-geo.onroerenderfgoed.be/adressenregister/gewesten/3000/provincies', {
    fixture: 'provinciesWaalsGewest.json',
  }).as('dataGetProvinciesWaalsGewest');

  // Gemeenten
  cy.intercept('GET', 'https://test-geo.onroerenderfgoed.be/adressenregister/gewesten/2000/gemeenten*', {
    fixture: 'gemeentenVlaamsGewest.json',
  }).as('dataGetGemeentenVlaamsGewest');
  cy.intercept('GET', 'https://test-geo.onroerenderfgoed.be/adressenregister/gewesten/3000/gemeenten*', {
    fixture: 'gemeentenWaalsGewest.json',
  }).as('dataGetGemeentenWaalsGewest');
  cy.intercept('GET', 'https://test-geo.onroerenderfgoed.be/adressenregister/gewesten/4000/gemeenten*', {
    fixture: 'gemeentenBrusselsHoofdstedelijkGewest.json',
  }).as('dataGetGemeentenBrusselsHoofdstedelijkGewest');

  // Info Bertem
  cy.intercept('GET', 'https://test-geo.onroerenderfgoed.be/adressenregister/gemeenten/Bertem/postinfo*', {
    fixture: 'postinfoBertem.json',
  }).as('dataGetPostinfoBertem');
  cy.intercept('GET', 'https://test-geo.onroerenderfgoed.be/adressenregister/gemeenten/24009/straten*', {
    fixture: 'stratenBertem.json',
  }).as('dataGetStratenBertem');
  cy.intercept('GET', 'https://test-geo.onroerenderfgoed.be/adressenregister/straten/32110/adressen*', {
    fixture: 'adressenDorpstraatBertem.json',
  }).as('dataGetAdressenDorpstraatBertem');
  cy.intercept('GET', 'https://test-geo.onroerenderfgoed.be/adressenregister/straten/32110/huisnummers/416*', {
    fixture: 'huisnummersDorpstraatBertem.json',
  }).as('dataGetHuisnummersDorpstraatBertem');
});

declare global {
  namespace Cypress {
    interface Chainable {
      dataCy(name: string): Chainable<Element>;
      mockAdressenregister(): void;
    }
  }
}

export {};
