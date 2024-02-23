import schema from '../../cypress/fixtures/workflowSchema.json';
import { mount } from 'cypress/vue';
import { defineComponent, useAttrs } from 'vue';
import GridWorkflow from '@components/dumb/GridWorkflow.vue';

const data = [
  {
    actor: 'https://dev-id.erfgoed.net/actoren/12653',
    datum: '2024-01-09T10:39:15.996776+01:00',
    state: {
      id: 0,
    },
    owners: [
      {
        id: 'https://dev-id.erfgoed.net/actoren/12564',
        type: 'actor',
        omschrijving: 'Van Humbeeck, Astrid',
      },
    ],
    actor_omschrijving: 'Proces energieadvies',
  },
  {
    actor: 'https://dev-id.erfgoed.net/actoren/12618',
    datum: '2024-01-09T15:51:43.786767+01:00',
    state: {
      id: 1,
      comment: 'Test',
      state_qualifier: 1,
    },
    owners: [
      {
        id: 'https://dev-id.erfgoed.net/actoren/12564',
        type: 'actor',
        omschrijving: 'Van Humbeeck, Astrid',
      },
    ],
    actor_omschrijving: 'Adriaens, Wouter',
  },
];

const TestComponent = defineComponent({
  components: { GridWorkflow },
  setup() {
    const attrs = useAttrs();
    return { attrs };
  },
  template: `<div style="width: 100%; height: 300px">
  <GridWorkflow v-bind="attrs"></GridWorkflow>
  </div>`,
});

describe('GridWorkflow - no data', () => {
  it('renders', () => {
    mount(TestComponent, { props: { data: [], schema: [] } });
  });

  it('shows the correct no rows melding', () => {
    mount(TestComponent, { props: { data: [], schema: [] } });
    cy.dataCy('ag-overlay').invoke('text').should('contain', 'Er zijn nog geen workflow gegevens beschikbaar');
  });
});

describe('GridWorkflow - data', () => {
  it('renders', () => {
    mount(TestComponent, {
      props: { data: data, schema: schema },
    });
  });

  it('renders 2 rows', () => {
    mount(TestComponent, {
      props: { data: data, schema: schema },
    });
    cy.dataCy('ag-grid-vue').find('.ag-center-cols-container').children().should('have.length', 2);
  });
});
