/// <reference types="cypress" />

// Helper function to mock land-related API calls
const mockLanden = () => {
  cy.intercept('GET', '**/adressenregister/landen*', { fixture: 'landen.json' }).as('dataGetLanden');
};

// Helper function to mock gemeente-related API calls
const mockGemeenten = () => {
  cy.intercept('GET', '**/adressenregister/gewesten/2000/gemeenten*', { fixture: 'gemeentenVlaamsGewest.json' }).as(
    'dataGetGemeentenVlaamsGewest'
  );
  cy.intercept('GET', '**/adressenregister/gewesten/3000/gemeenten*', { fixture: 'gemeentenWaalsGewest.json' }).as(
    'dataGetGemeentenWaalsGewest'
  );
  cy.intercept('GET', '**/adressenregister/gewesten/4000/gemeenten*', {
    fixture: 'gemeentenBrusselsHoofdstedelijkGewest.json',
  }).as('dataGetGemeentenBrusselsHoofdstedelijkGewest');
};

// Helper function to mock provincie-related API calls
const mockProvincies = () => {
  cy.intercept('GET', '**/adressenregister/gewesten/2000/provincies*', { fixture: 'provinciesVlaamsGewest.json' }).as(
    'dataGetProvinciesVlaamsGewest'
  );
  cy.intercept('GET', '**/adressenregister/gewesten/3000/provincies*', { fixture: 'provinciesWaalsGewest.json' }).as(
    'dataGetProvinciesWaalsGewest'
  );
};

// Helper function to mock gewest-related API calls
const mockGewesten = () => {
  cy.intercept('GET', '**/adressenregister/gewesten*', { fixture: 'gewesten.json' }).as('dataGetGewesten');
};

// Helper function to mock Bertem-related API calls
const mockBertem = () => {
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
  cy.intercept('GET', '**/adressenregister/straten/32110/huisnummers/383A*', { body: [] });
};

// Helper function to mock Bierbeek-related API calls
const mockBierbeek = () => {
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
};

// Helper function to mock Durbuy-related API calls
const mockDurbuy = () => {
  cy.intercept('GET', '**/adressenregister/gemeenten/Durbuy/postinfo*', { body: [] }).as('dataGetPostinfoDurbuy');
  cy.intercept('GET', '**/adressenregister/gemeenten/83012/straten*', { fixture: 'stratenDurbuy.json' }).as(
    'dataGetStratenDurbuy'
  );
  cy.intercept('GET', '**/adressenregister/straten/125552/adressen*', { body: [] }).as('dataGetAdressenDurbuy');
};

// Helper function to mock Aalst-related API calls
const mockAalst = () => {
  cy.intercept('GET', '**/adressenregister/gemeenten/Aalst/postinfo*', { fixture: 'postinfoAalst.json' }).as(
    'dataGetPostinfoAalst'
  );
  cy.intercept('GET', '**/adressenregister/gemeenten/41002/straten*', { fixture: 'stratenAalst.json' }).as(
    'dataGetStratenAalst'
  );
};

// Helper function to mock Brussel-related API calls
const mockBrussel = () => {
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
};

// Main mock function to call all helpers
Cypress.Commands.add('mockAdressenregister', () => {
  mockLanden();
  mockGemeenten();
  mockProvincies();
  mockGewesten();
  mockBertem();
  mockBierbeek();
  mockDurbuy();
  mockAalst();
  mockBrussel();
});

Cypress.Commands.add('mockLanden', mockLanden);
Cypress.Commands.add('mockGemeenten', mockGemeenten);
Cypress.Commands.add('mockProvincies', mockProvincies);
Cypress.Commands.add('mockGewesten', mockGewesten);
Cypress.Commands.add('mockBertem', mockBertem);
Cypress.Commands.add('mockBierbeek', mockBierbeek);
Cypress.Commands.add('mockDurbuy', mockDurbuy);
Cypress.Commands.add('mockAalst', mockAalst);
Cypress.Commands.add('mockBrussel', mockBrussel);

// Custom command to select elements by data-cy attribute
Cypress.Commands.add('dataCy', (name: string) => {
  cy.get(`[data-cy="${name}"]`);
});

declare global {
  namespace Cypress {
    interface Chainable {
      dataCy(name: string): Chainable<Element>;
      mockAdressenregister(): void;
      mockLanden(): void;
      mockGemeenten(): void;
      mockProvincies(): void;
      mockGewesten(): void;
      mockBertem(): void;
      mockBierbeek(): void;
      mockDurbuy(): void;
      mockAalst(): void;
      mockBrussel(): void;
    }
  }
}

export {};
