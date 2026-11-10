/* eslint-disable vue/one-component-per-file */
import { createPinia, setActivePinia } from 'pinia';
import { defineComponent } from 'vue';
import { useUtilStore } from '@/core';
import { LayerType, OeMap, OeMapProps, defaultControlConfig } from '@components/map';

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
      template: `<oe-map ref="map" v-model:zone="props.zone" v-bind="props" style="height: 100vh" />`,
    });

    beforeEach(() => {
      setActivePinia(createPinia());
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

    it('zooms to current location without tracking by default', () => {
      cy.window().then((win) => {
        const getCurrentPosition = cy.stub(win.navigator.geolocation, 'getCurrentPosition');
        const watchPosition = cy.stub(win.navigator.geolocation, 'watchPosition');

        cy.mount(TestComponent, {
          props: {
            controlConfig: {
              ...defaultControlConfig,
              zoomGeoLocation: true,
            },
          },
        });

        cy.dataCy('olMap').find('.oe-ol-geolocate button').click();

        cy.wrap(getCurrentPosition).should('have.been.calledOnce');
        cy.wrap(watchPosition).should('not.have.been.called');
      });
    });

    it('shows a warning when current location cannot be obtained', () => {
      cy.window().then((win) => {
        cy.stub(win.navigator.geolocation, 'getCurrentPosition').callsFake((_success, error) => {
          error?.({
            code: 1,
            message: 'Permission denied',
          } as GeolocationPositionError);
        });

        cy.mount(TestComponent, {
          props: {
            controlConfig: {
              ...defaultControlConfig,
              zoomGeoLocation: true,
            },
          },
        }).then(() => {
          const utilStore = useUtilStore();
          cy.spy(utilStore, 'addToast').as('addToast');

          cy.dataCy('olMap').find('.oe-ol-geolocate button').click();

          cy.get('@addToast').should(
            'have.been.calledWith',
            Cypress.sinon.match({
              type: 'warning',
              title: 'Locatie niet beschikbaar',
            }),
            5000
          );
        });
      });
    });

    it('zoomToCurrentLocation does not start tracking when tracking is enabled', () => {
      cy.window().then((win) => {
        const getCurrentPosition = cy.stub(win.navigator.geolocation, 'getCurrentPosition');
        const watchPosition = cy.stub(win.navigator.geolocation, 'watchPosition');

        cy.mount(TestComponent, {
          props: {
            controlConfig: {
              ...defaultControlConfig,
              zoomGeoLocation: true,
              geolocateTracking: true,
            },
          },
        }).then(({ component }) => {
          const map = (component.$refs.map as typeof OeMap).map;
          const geoControl = map
            .getControls()
            .getArray()
            .find((control) =>
              (control as unknown as { element?: Element }).element?.classList.contains('oe-ol-geolocate')
            ) as unknown as { zoomToCurrentLocation: () => void };

          geoControl.zoomToCurrentLocation();

          cy.wrap(getCurrentPosition).should('have.been.calledOnce');
          cy.wrap(watchPosition).should('not.have.been.called');
          cy.dataCy('olMap').find('.oe-ol-geolocate').should('not.have.class', 'tracking-on');
        });
      });
    });

    it('tracks current location when geolocateTracking is enabled', () => {
      cy.window().then((win) => {
        const watchPosition = cy.stub(win.navigator.geolocation, 'watchPosition').callsFake((success) => {
          success({
            coords: {
              latitude: 51.025,
              longitude: 4.36,
              accuracy: 10,
              altitude: null,
              altitudeAccuracy: null,
              heading: null,
              speed: null,
            },
            timestamp: Date.now(),
          } as GeolocationPosition);

          return 1;
        });

        const clearWatch = cy.stub(win.navigator.geolocation, 'clearWatch');

        cy.mount(TestComponent, {
          props: {
            controlConfig: {
              ...defaultControlConfig,
              zoomGeoLocation: true,
              geolocateTracking: true,
            },
          },
        });

        cy.dataCy('olMap').find('.oe-ol-geolocate button').click();

        cy.wrap(watchPosition).should('have.been.calledOnce');
        cy.dataCy('olMap').find('.oe-ol-geolocate').should('have.class', 'tracking-on');

        cy.dataCy('olMap').find('.oe-ol-geolocate-marker').should('exist').and('have.class', 'tracking-on');
        cy.dataCy('olMap').find('.oe-ol-geolocate-marker .dot').should('exist');
        cy.dataCy('olMap').find('.oe-ol-geolocate-marker .halo').should('exist');

        cy.dataCy('olMap').find('.oe-ol-geolocate button').click();

        cy.wrap(clearWatch).should('have.been.calledWith', 1);
        cy.dataCy('olMap').find('.oe-ol-geolocate').should('not.have.class', 'tracking-on');
        cy.dataCy('olMap').find('.oe-ol-geolocate-marker').should('not.exist');
      });
    });

    it('includes geoportaal parameters in the opened uri when clicking the zoom switcher', () => {
      cy.mount(TestComponent, {
        props: {
          controlConfig: {
            ...defaultControlConfig,
            zoomSwitcher: true,
          },
          geoportaalParameters: {
            laag: 'test-laag',
          },
        },
      }).then(() => {
        cy.window().then((win) => {
          cy.stub(win, 'open').as('windowOpen');

          cy.dataCy('olMap').find('.zoomButton').click();

          cy.get('@windowOpen').should('have.been.calledOnce');

          cy.get('@windowOpen').then((openStub) => {
            const windowOpenStub = openStub as unknown as { getCall: (index: number) => { args: unknown[] } };
            const openedUrl = String(windowOpenStub.getCall(0).args[0]);
            const openedUri = new URL(openedUrl);

            expect(openedUri.searchParams.get('laag')).to.eq('test-laag');
            expect(openedUri.searchParams.has('zoom')).to.eq(true);
            expect(openedUri.searchParams.has('lat')).to.eq(true);
            expect(openedUri.searchParams.has('lon')).to.eq(true);
          });
        });
      });
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

    it('zoomToExtent respects the provided maxZoom argument instead of the prop value', () => {
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

        const smallExtent = [100, 100, 100.0001, 100.0001];
        mapComponent.zoomToExtent(smallExtent, 4);

        cy.wrap(null, { timeout: 2000 }).should(() => {
          const view = map.getView();
          expect(view.getZoom()).to.eq(4);
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

  describe('location point mode', () => {
    it('does not emit map:click when locationPointMode is false', () => {
      const onMapClick = cy.spy().as('mapClick');

      const TestComponent = defineComponent({
        components: { OeMap },
        setup() {
          return {
            props: {
              locationPointMode: false,
            },
            onMapClick,
          };
        },
        template: `<OeMap ref="map" v-bind="props" @map:click="onMapClick" style="height: 400px" />`,
      });

      cy.mount(TestComponent);
      cy.get('.ol-viewport').click(200, 200);
      cy.get('@mapClick').should('not.have.been.called');
    });

    it('emits map:click and adds marker when locationPointMode is true', () => {
      const onMapClick = cy.spy().as('mapClick');

      const TestComponent = defineComponent({
        components: { OeMap },
        setup() {
          return {
            props: {
              locationPointMode: true,
            },
            onMapClick,
          };
        },
        template: `<OeMap ref="map"  v-bind="props" @map:click="onMapClick" style="height: 400px" />`,
      });

      cy.mount(TestComponent).then(({ component }) => {
        cy.get('.ol-viewport').click(200, 200);

        cy.get('@mapClick').should('have.been.calledOnce');

        const map = (component.$refs?.map as typeof OeMap).map;
        const markerLayer = map
          .getLayers()
          .getArray()
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .find((layer: any) => layer.get?.('id') === 'markerLayer');

        cy.wrap(null, { timeout: 2000 }).should(() => {
          expect(markerLayer.getSource().getFeatures()).to.have.length(1);
        });
      });
    });
  });
});
