import OeSideNavigation from '@components/core/dumb/OeSideNavigation.vue';
import {
  OeSideNavigationProps,
  SideNavigationRoute,
  SideNavigationSection,
} from '@components/core/models/side-navigation';

const sideNavigation: SideNavigationSection[] = [
  {
    text: 'Section 1',
    ref: 'section1',
    links: [
      { name: 'home', label: 'Home' },
      { name: 'about', label: 'About' },
    ],
  },
  {
    text: 'Section 2',
    ref: 'section2',
    links: [
      { name: 'contact', label: 'Contact' },
      { name: 'help', label: 'Help' },
    ],
  },
];

const routeMatchesSection1: SideNavigationRoute[] = [{ name: 'section1' }, { name: 'home' }];
const routeMatchesSection2: SideNavigationRoute[] = [{ name: 'section2' }, { name: 'contact' }];

const mountComponent = ({
  sideNavigation: nav = sideNavigation,
  routeMatches = routeMatchesSection1,
  autoExpand = true,
  onNavigate,
}: Partial<OeSideNavigationProps> = {}) => {
  cy.mount(OeSideNavigation as never, {
    props: {
      sideNavigation: nav,
      routeMatches,
      autoExpand,
      onNavigate: onNavigate ?? cy.stub().as('onNavigate'),
    },
  });
};

describe('OeSideNavigation', () => {
  it('renders all sections and links', () => {
    mountComponent();
    cy.contains('Section 1').should('exist');
    cy.contains('Section 2').should('exist');
    cy.contains('Home').should('exist');
    cy.contains('About').should('exist');
    cy.contains('Contact').should('exist');
    cy.contains('Help').should('exist');
  });

  it('expands the active section when autoExpand is true', () => {
    mountComponent({ routeMatches: routeMatchesSection1, autoExpand: true });
    cy.get('.vl-side-navigation__toggle[aria-expanded="true"]').should('exist');
  });

  it('does not expand any section when autoExpand is false', () => {
    mountComponent({ routeMatches: routeMatchesSection1, autoExpand: false });
    cy.get('.vl-side-navigation__toggle[aria-expanded="true"]').should('not.exist');
  });

  it('expands the correct section based on routeMatches', () => {
    mountComponent({ routeMatches: routeMatchesSection2 });
    cy.get('.vl-side-navigation__toggle[aria-expanded="true"]').parent().should('contain.text', 'Section 2');
  });

  it('opens a section when its toggle is clicked', () => {
    mountComponent({ autoExpand: false });
    cy.contains('Section 2')
      .parent()
      .find('.vl-side-navigation__toggle')
      .as('section2Toggle')
      .should('have.attr', 'aria-expanded', 'false');
    cy.get('@section2Toggle').click();
    cy.get('@section2Toggle').should('have.attr', 'aria-expanded', 'true');
  });

  it('closes a section when its toggle is clicked again', () => {
    mountComponent({ autoExpand: false });
    cy.contains('Section 2').parent().find('.vl-side-navigation__toggle').as('section2Toggle');
    cy.get('@section2Toggle').click();
    cy.get('@section2Toggle').should('have.attr', 'aria-expanded', 'true');
    cy.get('@section2Toggle').click();
    cy.get('@section2Toggle').should('have.attr', 'aria-expanded', 'false');
  });

  it('calls onNavigate with correct route name when a link is clicked', () => {
    mountComponent();
    cy.contains('About').click();
    cy.get('@onNavigate').should('have.been.calledWith', 'about');
    cy.contains('Section 2')
      .parent()
      .find('.vl-side-navigation__toggle')
      .as('section2Toggle')
      .should('have.attr', 'aria-expanded', 'false');
    cy.get('@section2Toggle').click();
    cy.contains('Contact').click();
    cy.get('@onNavigate').should('have.been.calledWith', 'contact');
  });
});
