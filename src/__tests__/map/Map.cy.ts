/* eslint-disable vue/one-component-per-file */
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

  describe('zoom levels', () => {
    it('respects zoomlevel, minZoomlevel, and maxZoomlevel props', () => {
      const TestComponent = defineComponent({
        components: { OeMap },
        setup() {
          return {
            props: {
              layerConfig: {
                baseLayers: {},
                overlays: {},
              },
              zoomlevel: 5,
              minZoomlevel: 4,
              maxZoomlevel: 6,
            },
          };
        },
        template: `<OeMap ref="map" v-bind="props" style="height: 400px" />`,
      });

      cy.mount(TestComponent).then(({ component }) => {
        const map = (component.$refs?.map as typeof OeMap).map;
        const view = map.getView();
        expect(view.getZoom()).to.eq(5);
        expect(view.getMinZoom()).to.eq(4);
        expect(view.getMaxZoom()).to.eq(6);
      });
    });

    it('zoomToExtent uses maxZoomlevel if extent is too small', () => {
      const TestComponent = defineComponent({
        components: { OeMap },
        setup() {
          return {
            props: {
              layerConfig: {
                baseLayers: {},
                overlays: {},
              },
              zoomlevel: 5,
              minZoomlevel: 4,
              maxZoomlevel: 6,
            },
          };
        },
        template: `<OeMap ref="map" v-bind="props" style="height: 400px" />`,
      });

      cy.mount(TestComponent).then(({ component }) => {
        const mapComponent = component.$refs.map as typeof OeMap;
        const map = mapComponent.map;

        // Simulate a very small extent (should trigger maxZoomlevel)
        const smallExtent = [100, 100, 100.0001, 100.0001];
        mapComponent.zoomToExtent(smallExtent);

        cy.wrap(null, { timeout: 2000 }).should(() => {
          const view = map.getView();
          expect(view.getZoom()).to.eq(6); // Should be maxZoomlevel
        });
      });
    });

    it('uses default zoomlevel, minZoomlevel, and maxZoomlevel when props are not set', () => {
      const TestComponent = defineComponent({
        components: { OeMap },
        setup() {
          return {
            props: {
              layerConfig: {
                baseLayers: {},
                overlays: {},
              },
            },
          };
        },
        template: `<OeMap ref="map" v-bind="props" style="height: 400px" />`,
      });

      cy.mount(TestComponent).then(({ component }) => {
        const map = (component.$refs?.map as typeof OeMap).map;
        const view = map.getView();
        expect(view.getZoom()).to.eq(2);
        expect(view.getMinZoom()).to.eq(2);
        expect(view.getMaxZoom()).to.eq(15);
      });
    });
  });
});
