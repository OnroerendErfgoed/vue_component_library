import { defineComponent } from 'vue';
import { LayerType } from '@/models';
import { OeZoneerder } from '@components/smart';
import type { OeZoneerderProps } from '@/models';

describe('OeZoneerder', () => {
  describe('default', () => {
    const TestComponent = defineComponent({
      components: { OeZoneerder },
      setup(props: OeZoneerderProps) {
        const defaultProps = {
          layerConfig: {
            baseLayers: {},
            overlays: {},
          },
        };
        props = { ...defaultProps, ...props };
        return { props };
      },
      template: `<oe-zoneerder v-model:zone="props.zone" v-bind="props" style="height: 100vh" />`,
    });

    beforeEach(() => {
      cy.viewport('macbook-16');
    });

    it('loads openlayers map', () => {
      cy.mount(TestComponent);
      cy.get('.ol-viewport');
    });

    it('updates the provided zone', () => {
      const wkt =
        'MULTIPOLYGON(((161224.97845101 212135.39413324, 161227.78030702 212146.77013324, 161227.79144301 212149.23784525, 161227.18613102 212151.84712525, 161227.10414701 212155.79176525, 161227.01077101 212160.28341325, 161226.58331501 212161.16456525, 161219.72001901 212172.48002126, 161216.50203501 212180.24232526, 161215.619987 212182.37000527, 161210.879955 212192.90005327, 161206.650003 212200.76994128, 161204.026451 212205.67893328, 161202.14997099 212209.18997329, 161196.13006699 212222.70997329, 161195.37025899 212224.6055893, 161192.23003499 212232.4400213, 161188.71995499 212238.6398933, 161183.70997098 212247.58997331, 161182.12635498 212250.23675732, 161178.01998698 212257.09998932, 161174.55829097 212262.74952532, 161173.01998697 212265.26005333, 161171.94997098 212268.24002133, 161171.87995498 212268.61000533, 161174.68001898 212277.42402133, 161179.16155498 212296.29506135, 161179.09979498 212299.29941335, 161177.44718698 212299.33333335, 161120.17633894 212265.64232532, 161117.56142694 212260.76846932, 161116.00033893 212255.48296532, 161114.33013093 212251.16654931, 161094.47560292 212215.89243729, 161126.20827495 212188.88558927, 161134.88161895 212185.71592527, 161155.68385896 212173.54862926, 161159.50958697 212171.90786126, 161161.15457897 212170.49544526, 161163.44955497 212169.01435726, 161164.32494697 212165.10280526, 161164.48328297 212162.31176525, 161163.84174697 212157.13877325, 161164.75221097 212155.95643725, 161164.93704297 212153.82907725, 161162.30293097 212150.97518925, 161162.02721897 212148.16750924, 161163.17115497 212146.32686924, 161162.07003497 212142.38914124, 161214.410771 212117.61026122, 161216.702355 212116.52526922, 161224.02869101 212113.05698122, 161224.97845101 212135.39413324)))';
      cy.mount(TestComponent, { props: { drawPanelEnabled: true, } });
      cy.dataCy('zonePanelControl').click();
      cy.dataCy('showWKTInput').click();
      cy.dataCy('WKTInput').type(wkt, { delay: 0 });
      cy.dataCy('plaatsWKT').click();
      cy.dataCy('geometryObjectList').should('have.length', 1);
    });

    it('shows flash, zoom and delete feature buttons', () => {
      cy.mount(TestComponent, {
        props: {
          drawPanelEnabled: true,
          zone: {
            type: 'MultiPolygon',
            coordinates: [
              [
                [
                  [152362.90394889, 213066.79304588],
                  [152362.33710089, 213066.81429388],
                  [152341.61601287, 213067.59202188],
                  [152339.99700487, 213029.92098185],
                  [152340.53703687, 213029.89851785],
                  [152361.39399689, 213029.03202185],
                  [152362.07585289, 213046.08514186],
                  [152362.90394889, 213066.79304588],
                ],
              ],
            ],
            crs: {
              type: 'name',
              properties: {
                name: 'urn:ogc:def:crs:EPSG::31370',
              },
            },
          }
        }
      });
      cy.dataCy('zonePanelControl').click();
      cy.dataCy('geometryObjectList').should('have.length', 1);
      cy.dataCy('flashFeatureBtn').should('exist');
      cy.dataCy('zoomFeatureBtn').should('exist');
      cy.dataCy('deleteFeatureBtn').should('exist');
    });

    it('removes a feature when delete button is clicked', () => {
      cy.mount(TestComponent, {
        props: {
          drawPanelEnabled: true,
          zone: {
            type: 'MultiPolygon',
            coordinates: [
              [
                [
                  [152362.90394889, 213066.79304588],
                  [152362.33710089, 213066.81429388],
                  [152341.61601287, 213067.59202188],
                  [152339.99700487, 213029.92098185],
                  [152340.53703687, 213029.89851785],
                  [152361.39399689, 213029.03202185],
                  [152362.07585289, 213046.08514186],
                  [152362.90394889, 213066.79304588],
                ],
              ],
            ],
            crs: {
              type: 'name',
              properties: {
                name: 'urn:ogc:def:crs:EPSG::31370',
              },
            },
          }
        }
      });
      cy.dataCy('zonePanelControl').click();
      cy.dataCy('geometryObjectList').should('have.length', 1);
      cy.dataCy('deleteFeatureBtn').click();
      cy.dataCy('geometryObjectList').should('not.be.visible');
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
    });
  });
});
