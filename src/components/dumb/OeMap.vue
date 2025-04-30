<template>
  <div ref="mapRef" data-cy="olMap" class="map">
    <oe-autocomplete
      data-cy="locationSearchInput"
      :callback-fn="performAutocompleteSearch"
      :placeholder="'Gemeente, straat of adres'"
      :value="autoCompleteValueRef"
      class="zone-search"
      @update:value="onAutocompleteFinished"
    ></oe-autocomplete>
    <div ref="leftControlsContainerRef" class="controlsContainer left">
      <div v-if="props.controlConfig.zoomSwitcher" class="zoom-switcher oe-ol-control ol-unselectable ol-control">
        <button class="zoomButton" title="Ga naar het Geoportaal" @click="zoomButtonClick">
          <font-awesome-icon :icon="['fas', 'fa-globe']"></font-awesome-icon>
        </button>
      </div>
      <slot name="leftControls"></slot>
    </div>
    <div ref="rightControlsContainerRef" class="controlsContainer right">
      <slot name="rightControls"></slot>
    </div>
    <layerswitcher @layerswitcher:mounted="addLayerswitcherControl"></layerswitcher>
    <slot name="panel"></slot>
  </div>
</template>

<!--suppress CommaExpressionJS -->
<script setup lang="ts">
import 'ol/ol.css';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Map from 'ol/Map';
import View from 'ol/View';
import { Attribution, Control, FullScreen, Rotate, ScaleLine, Zoom, ZoomToExtent } from 'ol/control';
import { getCenter, getTopLeft, getWidth } from 'ol/extent';
import Point from 'ol/geom/Point';
import { Group, Layer, Tile } from 'ol/layer';
import { type ProjectionLike, get as getOlProj, transformExtent } from 'ol/proj';
import { register } from 'ol/proj/proj4';
import { TileWMS, WMTS } from 'ol/source';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import proj4 from 'proj4';
import { onMounted, onUnmounted, provide, ref, watch } from 'vue';
import { LayerType, defaultControlConfig, defaultLayerConfig } from '@/models';
import { CrabApiService } from '@/services';
import OeAutocomplete from '@components/dumb/OeAutocomplete.vue';
import Layerswitcher from '@components/smart/OeZoneerderLayerswitcher.vue';
import { Geolocate } from '@utils/openlayers/oe-ol-geolocate';
import type { Coordinate } from 'ol/coordinate';
import type { Extent } from 'ol/extent';
import type { Projection } from 'ol/proj';
import type { Ref } from 'vue';
import type { IBoundingBox, LayerOptions, OeMapProps } from '@/models';
import type { IAutocompleteOption } from '@models/autocomplete';
import type { Contour } from '@models/oe-openlayers';

const props = withDefaults(defineProps<OeMapProps>(), {
  controlConfig: () => defaultControlConfig,
  layerConfig: () => defaultLayerConfig,
  api: 'https://geo.onroerenderfgoed.be/',
  zone: undefined,
});
const zone = ref<Contour | undefined>(props.zone);

const leftControlsContainerRef = ref<HTMLElement>() as Ref<HTMLElement>;
const rightControlsContainerRef = ref<HTMLElement>() as Ref<HTMLElement>;
const mapRef = ref<HTMLElement>();
const autoCompleteValueRef = ref<IAutocompleteOption>();

const emit = defineEmits(['map:created', 'update:zone']);

const extentVlaanderen: Extent = [9928.0, 66928.0, 272072.0, 329072.0];
const mapProjection = setupProjection();

const apiUrl = props.api.endsWith('/') ? props.api : `${props.api}/`;
const crabService = new CrabApiService(apiUrl);
let map: Map | undefined = new Map({
  view: new View({
    center: getCenter(extentVlaanderen),
    projection: mapProjection,
    zoom: 2,
    minZoom: 2,
    maxZoom: 15,
  }),
  layers: [getBaseLayerGroup(), ...getOverlays()],
  controls: [],
});

emit('map:created', map);
provide('map', map);
provide('crabService', crabService);
provide('zoomToExtent', zoomToExtent);
defineExpose({ map, crabService, zoomToExtent });

onMounted(() => {
  map?.setTarget(mapRef.value);
  addControls(leftControlsContainerRef.value, rightControlsContainerRef.value);
});

onUnmounted(() => {
  map?.setTarget(undefined);
  map = undefined;
});

watch(
  () => props.locatie,
  (newLocation) => {
    if (newLocation) {
      zoomToLocation(newLocation.id);
    }
  }
);
watch(zone, (newZone) => emit('update:zone', newZone), { deep: true });

function zoomToExtent(extent: Extent) {
  map?.updateSize();
  map?.getView().fit(extent, { maxZoom: 15 });
}

function zoomButtonClick() {
  const view = map?.getView() as View;
  const center = view.getCenter() as Coordinate;
  const zoom = view.getZoom() as number;
  const coordinates = transformLambert72ToWebMercator(center);

  //Zoom * 2 is some kind of hack so the zoom levels somewhat align with the zoom levels on crabpyUrl.
  // Change if a better solution is found.
  window.open(apiUrl + '#zoom=' + zoom * 2 + '&lat=' + coordinates[1] + '&lon=' + coordinates[0]);
}

function addLayerswitcherControl(element: HTMLElement) {
  map?.addControl(new Control({ element, target: leftControlsContainerRef.value }));
}

async function performAutocompleteSearch(searchValue: string): Promise<IAutocompleteOption<string>[]> {
  const responses = await crabService.getLocaties(searchValue).catch((e) => (console.error(e), []));
  return responses.map((response) => ({ title: response.locatie, value: response.id }));
}

function onAutocompleteFinished(result: IAutocompleteOption<string>) {
  if (!result.value) return;
  autoCompleteValueRef.value = result;
  zoomToLocation(result.value);
}

async function zoomToLocation(locationId: string) {
  const geoLocation = await crabService.geoLocate(locationId).catch((e) => (console.error(e), undefined));
  if (!geoLocation) return;

  const extent = transformBoundingboxToMapExtent(geoLocation.boundingbox);
  map?.getView()?.fit(extent);
  autoCompleteValueRef.value = undefined;
}

function transformBoundingboxToMapExtent(
  boundingbox: IBoundingBox,
  sourceCrs: ProjectionLike = 'EPSG:4326',
  targetCrs: ProjectionLike = 'EPSG:31370'
): Extent {
  const extent = [
    boundingbox.lowerleft.lon,
    boundingbox.lowerleft.lat,
    boundingbox.upperright.lon,
    boundingbox.upperright.lat,
  ];
  return transformExtent(extent, sourceCrs, targetCrs);
}

function transformLambert72ToWebMercator(center: Coordinate): Coordinate {
  const point: Point = new Point([center[0], center[1]]);
  const transFormedPoint = point.transform('EPSG:31370', 'EPSG:3857') as Point;

  return transFormedPoint.getCoordinates();
}

function setupProjection() {
  // Define projection EPSG:31370
  proj4.defs(
    'EPSG:31370',
    '+proj=lcc +lat_1=51.16666723333333 +lat_2=49.8333339 +lat_0=90 ' +
      '+lon_0=4.367486666666666 +x_0=150000.013 +y_0=5400088.438 +ellps=intl ' +
      '+towgs84=-106.869,52.2978,-103.724,0.3366,-0.457,1.8422,-1.2747 +units=m +no_defs'
  ); // epsg.io

  // Define aliases
  proj4.defs('urn:ogc:def:crs:EPSG::31370', proj4.defs('EPSG:31370'));
  proj4.defs('urn:ogc:def:crs:EPSG:6.9:31370', proj4.defs('EPSG:31370'));
  proj4.defs('urn:x-ogc:def:crs:EPSG:31370', proj4.defs('EPSG:31370'));
  proj4.defs('http://www.opengis.net/gml/srs/epsg.xml#31370', proj4.defs('EPSG:31370'));

  // Define projection EPSG:3812
  proj4.defs(
    'EPSG:3812',
    '+proj=lcc +lat_1=49.83333333333334 +lat_2=51.16666666666666 ' +
      '+lat_0=50.797815 +lon_0=4.359215833333333 +x_0=649328 +y_0=665262 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 ' +
      '+units=m +no_defs'
  );
  register(proj4);

  const projection = getOlProj('EPSG:31370') as Projection;
  projection.setExtent(extentVlaanderen);
  return projection;
}

function getBaseLayerGroup() {
  const layers = Object.keys(props.layerConfig.baseLayers)
    .map((id) => ({ id, options: props.layerConfig.baseLayers[id] }))
    .filter((layer) => !layer.options.hidden)
    .map(({ id, options }) => _createLayer(id, options, true))
    .reverse();
  const baseLayerGroup = new Group({ layers });
  baseLayerGroup.set('title', 'Achtergrond kaart');
  return baseLayerGroup;
}

function getOverlays() {
  return Object.keys(props.layerConfig.overlays)
    .map((id) => ({ id, options: props.layerConfig.overlays[id] }))
    .filter((layer) => !layer.options.hidden)
    .map(({ id, options }) => _createLayer(id, options, false))
    .reverse();
}

function _createLayer(id: string, layerOptions: LayerOptions, isBaseLayer: boolean) {
  let layer: Layer;

  if ([LayerType.GRB, LayerType.DHMV, LayerType.OMWRGBMRVL].includes(layerOptions.type))
    layer = _createGrbLayer(id, layerOptions.type);
  else if (layerOptions.type === LayerType.GrbWMS) layer = _createGrbWMSLayer(layerOptions.wmsLayers);
  else if (layerOptions.type === LayerType.ErfgoedWms) layer = _createErfgoedWMSLayer(layerOptions.wmsLayers);
  else if (layerOptions.type === LayerType.Ngi) layer = _createNgiLayer(id);
  else throw `unsupported layer type: ${layerOptions.type}`;

  layer.set('title', layerOptions.title);
  layer.set('type', isBaseLayer ? 'base' : 'overlay');
  if (layerOptions.type === LayerType.ErfgoedWms) {
    layer.set('legendImages', layerOptions.legendImages || []);
  }
  layer.setVisible(!!layerOptions.visible);

  return layer;
}

function _createGrbLayer(grbLayerId: string, type: LayerType) {
  const resolutions: number[] = [];
  const matrixIds: string[] = [];
  const maxResolution = getWidth(mapProjection.getExtent()) / 256;
  const origin = getTopLeft(mapProjection.getExtent());

  for (let i = 0; i < 16; i++) {
    matrixIds[i] = i.toString();
    resolutions[i] = maxResolution / Math.pow(2, i);
  }

  return new Tile({
    source: new WMTS({
      url: '//geo.api.vlaanderen.be/' + type + '/wmts',
      layer: grbLayerId,
      matrixSet: 'BPL72VL',
      format: 'image/png',
      projection: mapProjection,
      style: '',
      tileGrid: new WMTSTileGrid({ origin, resolutions, matrixIds }),
      attributions:
        '© <a href="https://www.vlaanderen.be/digitaal-vlaanderen" target="_blank" ' +
        'title="Informatie Vlaanderen" class="copyrightLink">Digitaal Vlaanderen</a>',
    }),
    extent: mapProjection.getExtent(),
  });
}

function _createNgiLayer(layerId: string) {
  const matrixIds = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  const resolutions = [
    1058.3333333327998, 529.1666666663999, 211.66666666656, 132.29166666659998, 66.14583333344, 26.45833333332,
    13.22916666666, 6.614583333344, 2.6458333333319994, 1.3229166666659997, 0.6614583333343999,
  ];
  const origin: Coordinate = [450000, 800000];

  return new Tile({
    source: new WMTS({
      urls: ['https://cartoweb.wmts.ngi.be/1.0.0/{layer}/{style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png'],
      requestEncoding: 'REST',
      layer: layerId,
      matrixSet: '3812',
      format: 'image/png',
      projection: 'EPSG:3812',
      style: 'default',
      tileGrid: new WMTSTileGrid({ origin, resolutions, matrixIds }),
      attributions:
        '© <a href="https://www.ngi.be/" target="_blank" title="Nationaal Geografisch Instituut" ' +
        'class="copyrightLink">NGI</a>',
    }),
    visible: false,
  });
}

function _createGrbWMSLayer(wmsLayers: string) {
  return new Tile({
    extent: mapProjection.getExtent(),
    source: new TileWMS({
      url: '//geo.api.vlaanderen.be/' + LayerType.GRB + '/wms',
      params: { LAYERS: wmsLayers, TILED: true },
      serverType: 'geoserver',
    }),
    maxResolution: 2000,
    visible: false,
  });
}

function _createErfgoedWMSLayer(wmsLayers: string) {
  return new Tile({
    extent: mapProjection.getExtent(),
    source: new TileWMS({
      url: `${apiUrl}geoserver/wms`,
      params: { LAYERS: wmsLayers, TILED: true },
      serverType: 'geoserver',
      attributions: '© <a href="https://www.onroerenderfgoed.be">Onroerend Erfgoed</a>',
    }),
    maxResolution: 2000,
    visible: false,
  });
}

function addControls(leftControlsContainer?: HTMLElement, rightControlsContainer?: HTMLElement) {
  map?.addControl(new Attribution({ collapsible: false }));
  map?.addControl(new ScaleLine());

  let target = leftControlsContainer;
  if (props.controlConfig.fullscreen) {
    const tipLabel = 'Vergroot / verklein het scherm';
    const className = 'oe-ol-fullscreen';
    map?.addControl(new FullScreen({ tipLabel, className, label: '', labelActive: '', target }));
  }
  if (props.controlConfig.zoomInOut) {
    const className = 'zoom oe-ol-control';
    const zoomInTipLabel = 'Zoom in';
    const zoomOutTipLabel = 'Zoom uit';
    map?.addControl(new Zoom({ zoomInTipLabel, zoomOutTipLabel, className, target }));
  }
  if (props.controlConfig.zoomFullExtent) {
    const extent = extentVlaanderen;
    const tipLabel = 'Zoom naar Vlaanderen';
    const className = 'oe-ol-control extent';
    map?.addControl(new ZoomToExtent({ extent, tipLabel, className, label: '', target }));
  }
  if (props.controlConfig.zoomGeoLocation) {
    const geolocateTracking: PositionOptions = { enableHighAccuracy: true, timeout: 5000, maximumAge: Infinity };
    map?.addControl(new Geolocate({ geolocateTracking, target }));
  }

  target = rightControlsContainer;
  if (props.controlConfig.rotate) {
    const tipLabel = 'Draai de kaart naar het noorden';
    const className = 'rotate oe-ol-control';
    map?.addControl(new Rotate({ tipLabel, className, target }));
  }
}
</script>

<style lang="scss">
@import 'pyoes/scss/base-variables';

.map {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  background-color: aliceblue;
  position: relative;
}

.zone-search {
  position: absolute !important;
  width: 300px !important;
  left: calc(50% - 150px);
  top: 0.5em;
}

.ol-hidden {
  display: none;
}

.controlsContainer {
  z-index: 1;
  position: absolute;
  width: 3em;
  display: flex;
  flex-direction: column;
  &.left {
    left: 0.5em;
  }
  &.right {
    right: 0.5em;
    .oe-ol-control {
      margin-left: auto;
    }
  }
}

.oe-ol-control,
.oe-ol-fullscreen {
  position: relative;
  border: 1px;
  top: 0.5em;
  width: fit-content;
  margin: 0 0 0.7rem 0;
  padding: 0.1px;

  button {
    color: $primary-color;
    background-color: $white;
    background-repeat: no-repeat;
    background-position: center;

    &:hover {
      color: $primary-color;
      outline-width: 0.2rem;
      outline-color: rgba($primary-color, 0.65);
    }
    &:focus {
      color: $primary-color;
      outline-width: 3px;
      outline-color: rgba($primary-color, 0.65);
    }
  }
}

.ol-attribution {
  position: absolute !important;
}

//right controls
.rotate.oe-ol-control {
  order: 1;
}

//left controls
.oe-ol-fullscreen {
  order: 0;
  button {
    background-image: url('data:image/svg+xml,<svg fill="%23944EA1" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M32 32C14.3 32 0 46.3 0 64v96c0 17.7 14.3 32 32 32s32-14.3 32-32V96h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H32zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7 14.3 32 32 32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H64V352zM320 32c-17.7 0-32 14.3-32 32s14.3 32 32 32h64v64c0 17.7 14.3 32 32 32s32-14.3 32-32V64c0-17.7-14.3-32-32-32H320zM448 352c0-17.7-14.3-32-32-32s-32 14.3-32 32v64H320c-17.7 0-32 14.3-32 32s14.3 32 32 32h96c17.7 0 32-14.3 32-32V352z"/></svg>');
  }
}

.zoom.oe-ol-control {
  order: 1;
}

.extent.oe-ol-control {
  order: 2;
  button {
    background-image: url('data:image/svg+xml,<svg fill="%23944EA1" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M200 32H56C42.7 32 32 42.7 32 56V200c0 9.7 5.8 18.5 14.8 22.2s19.3 1.7 26.2-5.2l40-40 79 79-79 79L73 295c-6.9-6.9-17.2-8.9-26.2-5.2S32 302.3 32 312V456c0 13.3 10.7 24 24 24H200c9.7 0 18.5-5.8 22.2-14.8s1.7-19.3-5.2-26.2l-40-40 79-79 79 79-40 40c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H456c13.3 0 24-10.7 24-24V312c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2l-40 40-79-79 79-79 40 40c6.9 6.9 17.2 8.9 26.2 5.2s14.8-12.5 14.8-22.2V56c0-13.3-10.7-24-24-24H312c-9.7 0-18.5 5.8-22.2 14.8s-1.7 19.3 5.2 26.2l40 40-79 79-79-79 40-40c6.9-6.9 8.9-17.2 5.2-26.2S209.7 32 200 32z"/></svg>');
  }
}

.oe-ol-geolocate.oe-ol-control {
  order: 3;
  button {
    background-image: url('data:image/svg+xml,<svg fill="%23944EA1" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 0c17.7 0 32 14.3 32 32V66.7C368.4 80.1 431.9 143.6 445.3 224H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H445.3C431.9 368.4 368.4 431.9 288 445.3V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V445.3C143.6 431.9 80.1 368.4 66.7 288H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H66.7C80.1 143.6 143.6 80.1 224 66.7V32c0-17.7 14.3-32 32-32zM128 256a128 128 0 1 0 256 0 128 128 0 1 0 -256 0zm128-80a80 80 0 1 1 0 160 80 80 0 1 1 0-160z"/></svg>');
  }
}
.zoom-switcher.oe-ol-control {
  order: 4;
}
.layerswitcher.oe-ol-control {
  order: 5;
}
</style>
