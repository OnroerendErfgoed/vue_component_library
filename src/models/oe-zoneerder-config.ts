import { LayerType } from '@/models';
import type { ILocatie, UrlString } from '@/models';
import type { Contour } from '@models/oe-openlayers';

export interface ControlConfig {
  fullscreen: boolean;
  zoomInOut: boolean;
  zoomFullExtent: boolean;
  zoomGeoLocation: boolean;
  rotate: boolean;
  zoomSwitcher: boolean;
}

export const defaultControlConfig: ControlConfig = {
  fullscreen: true,
  zoomInOut: true,
  zoomFullExtent: false,
  zoomGeoLocation: false,
  rotate: true,
  zoomSwitcher: false,
};

interface BaseLayerOptions {
  type: LayerType;
  title: string;
  visible?: boolean;
  hidden?: boolean;
}

interface LegendImage {
  title: string;
  path: string;
}

interface GrbOrNgiLayerOptions extends BaseLayerOptions {
  type: LayerType.Ngi | LayerType.GRB;
}

interface WmsLayerOptions extends BaseLayerOptions {
  wmsLayers: string;
}

export interface GrbWmsLayerOptions extends WmsLayerOptions {
  type: LayerType.GrbWMS;
}

export interface ErfgoedWmsLayerOptions extends WmsLayerOptions {
  type: LayerType.ErfgoedWms;
  legendImages?: LegendImage[];
}

export interface DHMVLayerOptions extends BaseLayerOptions {
  type: LayerType.DHMV;
}

export interface OMWRGBMRVLOptions extends BaseLayerOptions {
  type: LayerType.OMWRGBMRVL;
}

export type GrbLayerOptions = GrbOrNgiLayerOptions;
export type NgiLayerOptions = GrbOrNgiLayerOptions;

export type LayerOptions =
  | GrbLayerOptions
  | NgiLayerOptions
  | GrbWmsLayerOptions
  | ErfgoedWmsLayerOptions
  | DHMVLayerOptions
  | OMWRGBMRVLOptions;

export interface LayerConfig {
  baseLayers: { [layerId: string]: LayerOptions };
  overlays: { [layerId: string]: LayerOptions };
}

const legendPath = `geoserver/wms?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=`;
export const defaultLayerConfig: LayerConfig = {
  baseLayers: {
    omwrgbmrvl: { type: LayerType.OMWRGBMRVL, title: 'Ortho', visible: false },
    grb_bsk: { type: LayerType.GRB, title: 'GRB-Basiskaart', visible: false },
    grb_bsk_grijs: { type: LayerType.GRB, title: 'GRB-Basiskaart in grijswaarden', visible: true },
    topo: { type: LayerType.Ngi, title: 'Topokaart', visible: false },
    DHMV_II_HILL_25cm: { type: LayerType.DHMV, title: 'Hillshade 25cm', visible: false },
    DHMV_II_SVF_25cm: { type: LayerType.DHMV, title: 'Skyview 25cm', visible: false },
  },
  overlays: {
    overlay: { type: LayerType.Ngi, title: 'Topokaart overlay' },
    kunstwerken: { type: LayerType.GrbWMS, wmsLayers: 'GRB_KNW', title: 'GRB-Kunstwerkenlaag', hidden: true },
    gebouwen: { type: LayerType.GrbWMS, wmsLayers: 'GRB_GBG', title: 'GRB-Gebouwenlaag' },
    percelen: { type: LayerType.GrbWMS, wmsLayers: 'GRB_ADP_GRENS', title: 'GRB-Percelenlaag' },
    bes: {
      type: LayerType.ErfgoedWms,
      wmsLayers:
        'vioe_geoportaal:bes_landschap,' +
        'vioe_geoportaal:bes_sd_gezicht,' +
        'vioe_geoportaal:bes_arch_site,' +
        'vioe_geoportaal:bes_monument,' +
        'vioe_geoportaal:bes_overgangszone,' +
        'vioe_geoportaal:erfgoedls',
      title: 'Beschermd Onroerend Erfgoed',
      legendImages: [
        { title: 'cultuurhistorische landschappen', path: legendPath + 'vioe_geoportaal:bes_landschap' },
        { title: 'stads- en dorpsgezichten', path: legendPath + 'vioe_geoportaal:bes_sd_gezicht' },
        { title: 'archeologische sites', path: legendPath + 'vioe_geoportaal:bes_arch_site' },
        { title: 'monumenten', path: legendPath + 'vioe_geoportaal:bes_monument' },
        { title: 'overgangszones', path: legendPath + 'vioe_geoportaal:bes_overgangszone' },
      ],
    },
    gga: {
      type: LayerType.ErfgoedWms,
      wmsLayers: 'vioe_geoportaal:gga_gewestelijk,vioe_geoportaal:gga_gemeentelijk',
      title: 'Gebieden geen archeologie',
    },
    vast: {
      type: LayerType.ErfgoedWms,
      wmsLayers: 'vioe_geoportaal:vast_la',
      title: 'Vastgesteld landschapsrelict',
      visible: false,
    },
    UNESCO: {
      type: LayerType.ErfgoedWms,
      wmsLayers: 'vioe_geoportaal:unesco_kern,' + 'vioe_geoportaal:unesco_buffer',
      title: 'UNESCO',
      visible: false,
    },
  },
};

export interface FeatureSelectConfig {
  perceel: boolean;
  gebouw: boolean;
  kunstwerk: boolean;
}

export const defaultFeatureSelectConfig: FeatureSelectConfig = {
  perceel: true,
  gebouw: false,
  kunstwerk: false,
};

export interface OeZoneerderProps extends OeMapProps {
  featureSelectConfig?: FeatureSelectConfig;
  drawPanelEnabled?: boolean;
}

export interface OeMapProps {
  zone?: Contour;
  api?: UrlString;
  controlConfig?: ControlConfig;
  layerConfig?: LayerConfig;
  locatie?: ILocatie;
}
