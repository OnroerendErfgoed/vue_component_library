<template>
  <div ref="zonePanelRef" :class="{ hidden: !panelOpen }" class="panel">
    <vl-title class="panelHeader" tag-name="h4">
      <font-awesome-icon class="pointer" :icon="['fas', 'bars']" @click="togglePanel" />
      <span v-if="panelOpen" class="titleText">&nbsp;Zone samenstellen</span>
    </vl-title>

    <div v-if="panelOpen" class="panelBody">
      <vl-link v-if="isDrawing || selectPerceel" mod-link @click="toggleDrawZone(false)">
        <vl-icon icon="ban" /> Annuleren</vl-link
      >
      <template v-else>
        <vl-link @click="toggleDrawZone(true)"> <vl-icon icon="pencil" /> Teken polygoon</vl-link><br />
        <vl-link @click="toggleDrawZone(true, 'Circle')"> <vl-icon icon="pencil" /> Teken cirkel</vl-link><br />
        <vl-link @click="startPerceelSelect()"> <vl-icon icon="cursor-finger-up" /> Selecteer perceel</vl-link>
      </template>
      <br />
      <br />
      <vl-input-group>
        <vl-input-field
          id="map-address"
          name="map-address"
          placeholder="WKT string (Lambert72)"
          mod-block
          :model-value="WKTString"
          @update:model-value="updateWKTString"
        />
        <vl-input-addon tag-name="button" type="button" tooltip="WKT " text="Plaats" @click="drawWKTZone()" />
      </vl-input-group>
      <hr />
      <p><strong>Toegevoegde zones</strong></p>
      <ul class="geometryObjectList">
        <li v-for="(item, index) in geometryObjectList" :key="index">
          <span>{{ item }}</span>
          <vl-link class="iconLink" @click="removeGeometryObject(item)"> <vl-icon icon="trash" /> </vl-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import 'ol/ol.css';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  VlIcon,
  VlInputAddon,
  VlInputField,
  VlInputGroup,
  VlLink,
  VlTitle,
} from '@govflanders/vl-ui-design-system-vue3';
import { Feature, Map, MapBrowserEvent } from 'ol';
import { GeoJSON, WKT } from 'ol/format';
import { Circle, Geometry, MultiPolygon, Polygon } from 'ol/geom';
import { fromCircle } from 'ol/geom/Polygon';
import { Draw } from 'ol/interaction';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Fill, Text as OlText, Stroke, Style } from 'ol/style';
import { inject, ref, watch } from 'vue';
import { CrabApiService } from '@/services';
import { Contour } from '@models/oe-openlayers';
import type { FeatureLike } from 'ol/Feature';
import type { ColorLike } from 'ol/colorlike';
import type { Listener } from 'ol/events';
import type { Extent } from 'ol/extent';
import type { UrlString } from '@/models';
import type { IDrawGeomType } from '@models/oe-openlayers';

const props = defineProps<{
  zone?: Contour;
}>();
const zone = ref<Contour | undefined>(props.zone);
const emit = defineEmits(['update:zone']);
watch(zone, (newZone) => emit('update:zone', newZone));

const map = inject('map') as Map;
const zoomToExtent = inject('zoomToExtent') as (extent: Extent) => void;
const agivGrbUrl = inject('agivGrbUrl') as UrlString;
const crabService = inject('crabService') as CrabApiService;

const WKTString = ref('');
// GEOMETRYCOLLECTION(POLYGON ((161224.97845101 212135.39413324, 161227.78030702 212146.77013324, 161227.79144301 212149.23784525, 161227.18613102 212151.84712525, 161227.10414701 212155.79176525, 161227.01077101 212160.28341325, 161226.58331501 212161.16456525, 161219.72001901 212172.48002126, 161216.50203501 212180.24232526, 161215.619987 212182.37000527, 161210.879955 212192.90005327, 161206.650003 212200.76994128, 161204.026451 212205.67893328, 161202.14997099 212209.18997329, 161196.13006699 212222.70997329, 161195.37025899 212224.6055893, 161192.23003499 212232.4400213, 161188.71995499 212238.6398933, 161183.70997098 212247.58997331, 161182.12635498 212250.23675732, 161178.01998698 212257.09998932, 161174.55829097 212262.74952532, 161173.01998697 212265.26005333, 161171.94997098 212268.24002133, 161171.87995498 212268.61000533, 161174.68001898 212277.42402133, 161179.16155498 212296.29506135, 161179.09979498 212299.29941335, 161177.44718698 212299.33333335, 161120.17633894 212265.64232532, 161117.56142694 212260.76846932, 161116.00033893 212255.48296532, 161114.33013093 212251.16654931, 161094.47560292 212215.89243729, 161126.20827495 212188.88558927, 161134.88161895 212185.71592527, 161155.68385896 212173.54862926, 161159.50958697 212171.90786126, 161161.15457897 212170.49544526, 161163.44955497 212169.01435726, 161164.32494697 212165.10280526, 161164.48328297 212162.31176525, 161163.84174697 212157.13877325, 161164.75221097 212155.95643725, 161164.93704297 212153.82907725, 161162.30293097 212150.97518925, 161162.02721897 212148.16750924, 161163.17115497 212146.32686924, 161162.07003497 212142.38914124, 161214.410771 212117.61026122, 161216.702355 212116.52526922, 161224.02869101 212113.05698122, 161224.97845101 212135.39413324)))
const mapProjection = map.getView().getProjection();
const zonePanelRef = ref<HTMLElement>();
const panelOpen = ref(false);
const selectPerceel = ref(false);
const isDrawing = ref(false);
const geometryObjectList = ref<string[]>([]);

let circleIndex = 0;
let polygonIndex = 0;
const drawLayer = _createVectorLayer({
  color: 'rgb(39, 146, 195)',
  fill: 'rgba(39, 146, 195, 0.3)',
  title: 'Zone',
});
drawLayer.getSource()?.on('addfeature', () => {
  drawLayerToZone();
});
map.addLayer(drawLayer);
const geoJsonFormatter = new GeoJSON({
  dataProjection: mapProjection,
  featureProjection: mapProjection,
});
const perceelSelectCallback = (evt: MapBrowserEvent<UIEvent>) => {
  crabService.searchPerceel(evt.coordinate, mapProjection.getCode(), agivGrbUrl).then((result) => {
    geoJsonFormatter.readFeatures(result).forEach((perceel) => {
      drawPerceel(perceel);
    });
  });
};

const drawInteractions: { [type: string]: Draw } = _createInteractions();

function togglePanel() {
  panelOpen.value = !panelOpen.value;
}

function updateWKTString(value: string) {
  WKTString.value = value;
}

function _createVectorLayer(options: { color: ColorLike; fill: ColorLike; title: string }) {
  const getText = (feature: FeatureLike) =>
    new OlText({
      font: '10px Verdana',
      text: feature.get('name') || '',
      fill: new Fill({ color: options.color }),
      stroke: new Stroke({ color: '#fff', width: 3 }),
    });

  const getStyle = (feature: FeatureLike) =>
    new Style({
      stroke: new Stroke({ color: options.color, width: 3 }),
      fill: new Fill({ color: options.fill }),
      text: getText(feature),
    });
  const vLayer = new VectorLayer({
    source: new VectorSource(),
    style: getStyle,
    visible: true,
  });
  vLayer.set('title', options.title);
  vLayer.set('type', 'overlay');

  return vLayer;
}

function toggleDrawZone(drawZoneEnabled = false, type: IDrawGeomType = 'Polygon') {
  resetSelect();
  map.getInteractions().pop();
  isDrawing.value = drawZoneEnabled;
  for (const [drawType, interaction] of Object.entries(drawInteractions)) {
    if (drawType === type) {
      interaction.setActive(drawZoneEnabled);
      map.addInteraction(interaction);
    } else {
      interaction.setActive(false);
    }
  }
}

function resetSelect() {
  selectPerceel.value = false;
  if (perceelSelectCallback) {
    map.removeEventListener('click', perceelSelectCallback as Listener);
  }
}

function drawWKTZone() {
  const wktParser = new WKT();
  try {
    const featureFromWKT = wktParser.readFeature(WKTString.value);
    const name = `Polygoon ${polygonIndex++}`;
    featureFromWKT.setProperties({
      name: name,
    });
    drawLayer.getSource()?.addFeature(featureFromWKT);
    geometryObjectList.value.push(name);
    zoomToFeatures();
    WKTString.value = '';
  } catch (error) {
    console.error(error, 'Dit is een ongeldige WKT geometrie.');
  }
}

function zoomToFeatures() {
  const extent = drawLayer.getSource()?.getExtent();
  if (!extent) return;

  zoomToExtent(extent);
}

function startPerceelSelect() {
  toggleDrawZone(false);
  selectPerceel.value = true;
  map.on('click', perceelSelectCallback);
}

function drawPerceel(olFeature: Feature) {
  console.debug('drawPerceel');
  if (olFeature) {
    const name = `Perceel ${olFeature.get('CAPAKEY')}`;
    if (geometryObjectList.value.indexOf(name) === -1) {
      olFeature.set('name', name);
      if (drawLayer.getSource()) {
        drawLayer.getSource()?.addFeature(olFeature);
        geometryObjectList.value.push(name);
      }
    }
  } else {
    console.error('Er werd geen perceel gevonden op deze locatie.');
  }
}
function _createInteractions() {
  const drawInteractions = {
    Circle: new Draw({ type: 'Circle', source: drawLayer.getSource() as VectorSource }),
    Polygon: new Draw({ type: 'Polygon', source: drawLayer.getSource() as VectorSource }),
  };

  for (const [type, interaction] of Object.entries(drawInteractions)) {
    interaction.on('drawend', (evt) => {
      const name = type === 'Circle' ? `Cirkel ${circleIndex++}` : `Polygoon ${polygonIndex++}`;
      evt.feature.setProperties({ name });
      geometryObjectList.value.push(evt.feature.getProperties().name);
    });
    interaction.setActive(false);
  }
  return drawInteractions;
}

function removeGeometryObject(name: string) {
  const drawLayerSource = drawLayer.getSource();
  const featuresToRemove = drawLayerSource?.getFeatures().filter((feature) => feature.getProperties().name === name);
  featuresToRemove?.forEach((featureToRemove) => {
    drawLayerSource?.removeFeature(featureToRemove);
  });
  drawLayerToZone();
  if (zone.value?.coordinates.length === 0) {
    zone.value = undefined;
  }

  geometryObjectList.value.splice(geometryObjectList.value.indexOf(name), 1);
}

function drawLayerToZone() {
  const multiPolygon = new MultiPolygon([], 'XY');
  const features = drawLayer.getSource()?.getFeatures();
  features?.forEach((feature) => {
    const geom = feature.getGeometry();
    if (geom instanceof Polygon) {
      multiPolygon.appendPolygon(geom as Polygon);
    } else if (geom instanceof MultiPolygon) {
      geom.getPolygons().forEach((polygon: Polygon) => {
        multiPolygon.appendPolygon(polygon);
      });
    } else if (geom instanceof Circle) {
      multiPolygon.appendPolygon(fromCircle(geom));
    }
  });

  const contour = formatGeoJson(multiPolygon);
  zone.value = new Contour(contour);
}

function formatGeoJson(feature: Geometry) {
  const geojson = geoJsonFormatter.writeGeometryObject(feature);
  // hack to add crs. todo: remove when https://github.com/openlayers/ol3/issues/2078 is fixed
  Object.defineProperty(geojson, 'crs', {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
      type: 'name',
      properties: {
        name: 'urn:ogc:def:crs:EPSG::31370',
      },
    },
  });
  return geojson as Contour;
}
</script>

<style lang="scss" scoped>
.panel {
  margin: 0.5em;
  height: calc(100% - 1em);
  width: 350px;
  display: flex;
  flex-direction: column;
  z-index: 3;
  position: absolute;
  top: 0;
  right: 0;
  overflow: hidden;
  background-color: rgba(white, 0.9);
  border: solid 2px var(--ol-subtle-foreground-color);
  border-radius: 2px;

  .pointer {
    cursor: pointer;
  }

  .panelHeader {
    flex: 0;
    color: white;
    margin: 0;
    padding: 0.25em 0.5em;
    background-color: var(--ol-subtle-foreground-color);
  }

  .panelBody {
    flex: 1;
    overflow: auto;
    padding: 10px;
  }

  &.hidden {
    width: auto;
    height: auto;
    border: none;
  }

  .geometryObjectList {
    li {
      display: flex;
      align-items: end;
      span {
        flex: 1;
      }
      .iconLink {
        color: var(--ol-subtle-foreground-color);
      }
    }
  }
}
</style>
