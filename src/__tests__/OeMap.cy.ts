import { defineComponent } from 'vue';
import { LayerType, OeMap, OeMapProps } from '@components/map';

describe('OeMap', () => {
  describe('default', () => {
    const TestComponent = defineComponent({
      components: { OeMap },
      setup(props: OeMapProps) {
        const defaultProps = {
          layerConfig: {
            baseLayers: {},
            overlays: {},
          },
        };
        props = { ...defaultProps, ...props };
        return { props };
      },
      template: `<oe-map v-model:zone="props.zone" v-bind="props" style="height: 100vh" />`,
    });

    beforeEach(() => {
      cy.viewport('macbook-16');
    });

    it('loads openlayers map', () => {
      cy.mount(TestComponent);
      cy.get('.ol-viewport');
    });

    it('shows all enabled controls', () => {
      cy.mount(TestComponent, {
        props: {
          controlConfig: {
            fullscreen: true,
            zoomInOut: true,
            zoomFullExtent: true,
            zoomGeoLocation: true,
            rotate: true,
            zoomSwitcher: true,
          },
        },
      });
      cy.dataCy('olMap').find('.oe-ol-fullscreen').should('exist');
      cy.dataCy('olMap').find('.oe-ol-control-in').should('exist');
      cy.dataCy('olMap').find('.oe-ol-control.extent').should('exist');
      cy.dataCy('olMap').find('.oe-ol-geolocate').should('exist');
      cy.dataCy('olMap').find('.oe-ol-control .ol-compass').should('exist');
      cy.dataCy('olMap').find('.oe-ol-control .zoomButton').should('exist');
    });

    it('adds configured layers', () => {
      cy.mount(TestComponent, {
        props: {
          layerConfig: {
            baseLayers: {
              omwrgbmrvl: { type: LayerType.OMWRGBMRVL, title: 'Ortho', visible: true },
              kunstwerken: { type: LayerType.GrbWMS, wmsLayers: 'GRB_KNW', title: 'GRB-Kunstwerkenlaag', hidden: true },
            },
            overlays: {
              overlay: { type: LayerType.Ngi, title: 'Topokaart overlay' },
            },
          },
        },
      });
      cy.dataCy('olMap').find('.layerswitcher.oe-ol-control').click();
      cy.dataCy('layerswitcherPanel').should('contain', 'Ortho');
      cy.dataCy('layerswitcherPanel').should('contain', 'Topokaart overlay');
      cy.dataCy('layerswitcherPanel').should('not.contain', 'GRB-Kunstwerkenlaag');
    });
  });
});
