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
  rotate: false,
  zoomSwitcher: false,
};

interface BaseLayerOptions {
  type: LayerType;
  title: string;
  visible?: boolean;
  legendImages?: legendImage[];
}

interface legendImage {
  title: string;
  url: string;
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

const legendParams = `?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=`;
const legendBaseUrl = `https://geo.onroerenderfgoed.be/geoserver/wms${legendParams}`;
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
        { title: 'cultuurhistorische landschappen', url: legendBaseUrl + 'vioe_geoportaal:bes_landschap' },
        { title: 'stads- en dorpsgezichten', url: legendBaseUrl + 'vioe_geoportaal:bes_sd_gezicht' },
        { title: 'archeologische sites', url: legendBaseUrl + 'vioe_geoportaal:bes_arch_site' },
        { title: 'monumenten', url: legendBaseUrl + 'vioe_geoportaal:bes_monument' },
        { title: 'overgangszones', url: legendBaseUrl + 'vioe_geoportaal:bes_overgangszone' },
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

export interface OeZoneerderProps {
  zone?: Contour;
  api?: UrlString;
  controlConfig?: ControlConfig;
  layerConfig?: LayerConfig;
  beschermingenWmsUrl?: UrlString;
  agivGrbUrl?: UrlString;
  locatie?: ILocatie;
  drawPanelEnabled?: boolean;
}
