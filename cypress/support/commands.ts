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
  cy.intercept('GET', '**/adressenregister/landen*', { fixture: 'landen.json' }).as('dataGetLanden');

  // Gemeenten
  cy.intercept('GET', '**/adressenregister/gewesten/2000/gemeenten*', { fixture: 'gemeentenVlaamsGewest.json' }).as(
    'dataGetGemeentenVlaamsGewest'
  );
  cy.intercept('GET', '**/adressenregister/gewesten/3000/gemeenten*', { fixture: 'gemeentenWaalsGewest.json' }).as(
    'dataGetGemeentenWaalsGewest'
  );
  cy.intercept('GET', '**/adressenregister/gewesten/4000/gemeenten*', {
    fixture: 'gemeentenBrusselsHoofdstedelijkGewest.json',
  }).as('dataGetGemeentenBrusselsHoofdstedelijkGewest');

  // Provincies
  cy.intercept('GET', '**/adressenregister/gewesten/2000/provincies*', { fixture: 'provinciesVlaamsGewest.json' }).as(
    'dataGetProvinciesVlaamsGewest'
  );
  cy.intercept('GET', '**/adressenregister/gewesten/3000/provincies*', { fixture: 'provinciesWaalsGewest.json' }).as(
    'dataGetProvinciesWaalsGewest'
  );

  // Gewesten
  cy.intercept('GET', '**/adressenregister/gewesten*', { fixture: 'gewesten.json' }).as('dataGetGewesten');

  // Info Bertem
  cy.intercept('GET', '**/adressenregister/gemeenten/Bertem/postinfo*', { fixture: 'postinfoBertem.json' }).as(
    'dataGetPostinfoBertem'
  );
  cy.intercept('GET', '**/adressenregister/gemeenten/24009/straten*', { fixture: 'stratenBertem.json' }).as(
    'dataGetStratenBertem'
  );
  cy.intercept('GET', '**/adressenregister/straten/32110/adressen*', { fixture: 'adressenDorpstraatBertem.json' }).as(
    'dataGetAdressenDorpstraatBertem'
  );
  cy.intercept('GET', '**/adressenregister/straten/32110/huisnummers/416*', {
    fixture: 'huisnummersDorpstraatBertem.json',
  }).as('dataGetHuisnummersDorpstraatBertem');
  cy.intercept('GET', '**/adressenregister/straten/32110/huisnummers/383A*', {
    body: [],
  });

  // Info Bierbeek
  cy.intercept('GET', '**/adressenregister/gemeenten/Bierbeek/postinfo*', {
    body: [
      {
        postcode: '3360',
        uri: 'https://data.vlaanderen.be/id/postinfo/3360',
        status: 'gerealiseerd',
        namen: ['BIERBEEK', 'Korbeek-Lo', 'Lovenjoel', 'Opvelp'],
      },
    ],
  }).as('dataGetPostinfoBierbeek');
  cy.intercept('GET', '**/adressenregister/gemeenten/24011/straten*', { fixture: 'stratenBierbeek.json' }).as(
    'dataGetStratenBierbeek'
  );
  cy.intercept('GET', '**/adressenregister/straten/32284/adressen*', {
    fixture: 'adressenKrijkelbergBierbeek.json',
  }).as('dataGetAdressenKrijkelbergBierbeek');

  // Info Durbuy
  cy.intercept('GET', '**/adressenregister/gemeenten/Durbuy/postinfo*', { body: [] }).as('dataGetPostinfoDurbuy');
  cy.intercept('GET', '**/adressenregister/gemeenten/83012/straten*', { fixture: 'stratenDurbuy.json' }).as(
    'dataGetStratenDurbuy'
  );
  cy.intercept('GET', '**/adressenregister/straten/125552/adressen*', { body: [] }).as('dataGetAdressenDurbuy');

  // Info Aalst
  cy.intercept('GET', '**/adressenregister/gemeenten/Aalst/postinfo*', { fixture: 'postinfoAalst.json' }).as(
    'dataGetPostinfoAalst'
  );
  cy.intercept('GET', '**/adressenregister/gemeenten/41002/straten*', { fixture: 'stratenAalst.json' }).as(
    'dataGetStratenAalst'
  );

  // Info Brussel
  cy.intercept('GET', '**/adressenregister/gemeenten/Brussel/postinfo*', { fixture: 'postinfoBrussel.json' }).as(
    'dataGetPostinfoBrussel'
  );
  cy.intercept('GET', '**/adressenregister/gemeenten/21004/straten*', {
    body: [
      {
        id: '19887',
        naam: 'Havenlaan',
        homoniem: null,
        status: 'inGebruik',
        uri: 'https://data.vlaanderen.be/id/straatnaam/19887',
      },
    ],
  }).as('dataGetStratenBrussel');
  cy.intercept('GET', '**/adressenregister/straten/19887/adressen*', { body: [] }).as('dataGetAdressenBrussel');
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
