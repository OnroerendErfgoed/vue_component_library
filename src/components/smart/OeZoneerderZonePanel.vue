<template>
  <div ref="zonePanelRef" :class="{ closed: !panelOpen || !props.drawPanelEnabled }" class="panel">
    <div ref="elementRef" class="zone-panel oe-ol-control ol-control ol-unselectable">
      <button data-cy="zonePanelControl" @click="togglePanel">
        <font-awesome-icon icon="pencil" title="Zone samenstellen"></font-awesome-icon>
      </button>
    </div>

    <vl-title class="panelHeader" tag-name="h4">
      <span v-if="panelOpen" class="titleText">&nbsp;Zone samenstellen</span>
      <font-awesome-icon class="pointer" :icon="['fas', 'close']" @click="togglePanel"></font-awesome-icon>
    </vl-title>

    <div v-if="panelOpen" class="panelBody">
      <vl-input-group class="zone-input-group">
        <template v-if="!addingWKT">
          <vl-button
            mod-narrow
            :mod-secondary="!(activeDrawType === 'Polygon')"
            title="teken polygoon"
            @click="toggleDrawZone(true)"
          >
            <font-awesome-icon icon="draw-polygon"></font-awesome-icon>
          </vl-button>
          <vl-button
            mod-narrow
            :mod-secondary="!(activeDrawType === 'Circle')"
            title="teken cirkel"
            @click="toggleDrawZone(true, 'Circle')"
          >
            <font-awesome-icon :icon="['far', 'circle']"></font-awesome-icon>
          </vl-button>
          <vl-button
            vl-button
            mod-narrow
            :mod-secondary="!selectPerceel"
            title="selecteer perceel"
            @click="startPerceelSelect()"
          >
            <font-awesome-icon icon="map-marker-alt"></font-awesome-icon>
          </vl-button>
          <vl-button
            data-cy="showWKTInput"
            vl-button
            mod-narrow
            mod-secondary
            title="WKT string"
            @click="showWktInput()"
            >WKT</vl-button
          >
        </template>
        <template v-else>
          <vl-input-field
            id="map-address"
            data-cy="WKTInput"
            name="map-address"
            placeholder="WKT string (Lambert72)"
            mod-block
            :mod-error="invalidWKT"
            :model-value="WKTString"
            @update:model-value="updateWKTString"
          ></vl-input-field>
          <vl-button data-cy="plaatsWKT" vl-button mod-narrow mod-secondary @click="drawWKTZone()">Plaats</vl-button>
        </template>
        <vl-button title="annuleren" vl-button mod-narrow mod-secondary @click="toggleDrawZone(false)">
          <font-awesome-icon icon="cancel"></font-awesome-icon>
        </vl-button>
      </vl-input-group>

      <p><strong>Toegevoegde zones</strong></p>
      <ul data-cy="geometryObjectList" class="geometryObjectList">
        <li v-for="(item, index) in geometryObjectList" :key="index">
          <span>{{ item }}</span>
          <vl-link class="iconLink" @click="removeGeometryObject(item)"> <vl-icon icon="trash"></vl-icon> </vl-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import 'ol/ol.css';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { VlButton, VlIcon, VlInputField, VlInputGroup, VlLink, VlTitle } from '@govflanders/vl-ui-design-system-vue3';
import { Feature, Map, MapBrowserEvent } from 'ol';
import { GeoJSON, WKT } from 'ol/format';
import { Circle, Geometry, MultiPolygon, Polygon } from 'ol/geom';
import { fromCircle } from 'ol/geom/Polygon';
import { Draw } from 'ol/interaction';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Fill, Text as OlText, Stroke, Style } from 'ol/style';
import { inject, onMounted, onUnmounted, ref, watch } from 'vue';
import type { FeatureLike } from 'ol/Feature';
import type { ColorLike } from 'ol/colorlike';
import type { Listener } from 'ol/events';
import type { Extent } from 'ol/extent';
import type { CrabApiService } from '@/services';
import type { Contour, IDrawGeomType } from '@models/oe-openlayers';

const props = defineProps<{
  zone?: Contour;
  selectPerceel?: boolean;
  drawPanelEnabled?: boolean;
}>();
const zone = ref<Contour | undefined>(props.zone);
const elementRef = ref<HTMLElement>();
const emit = defineEmits(['update:zone', 'update:select-perceel', 'zone-panel:mounted']);

const map = inject('map') as Map;
const zoomToExtent = inject('zoomToExtent') as (extent: Extent) => void;
const crabService = inject('crabService') as CrabApiService;

const WKTString = ref('');
// GEOMETRYCOLLECTION(POLYGON ((161224.97845101 212135.39413324, 161227.78030702 212146.77013324, 161227.79144301 212149.23784525, 161227.18613102 212151.84712525, 161227.10414701 212155.79176525, 161227.01077101 212160.28341325, 161226.58331501 212161.16456525, 161219.72001901 212172.48002126, 161216.50203501 212180.24232526, 161215.619987 212182.37000527, 161210.879955 212192.90005327, 161206.650003 212200.76994128, 161204.026451 212205.67893328, 161202.14997099 212209.18997329, 161196.13006699 212222.70997329, 161195.37025899 212224.6055893, 161192.23003499 212232.4400213, 161188.71995499 212238.6398933, 161183.70997098 212247.58997331, 161182.12635498 212250.23675732, 161178.01998698 212257.09998932, 161174.55829097 212262.74952532, 161173.01998697 212265.26005333, 161171.94997098 212268.24002133, 161171.87995498 212268.61000533, 161174.68001898 212277.42402133, 161179.16155498 212296.29506135, 161179.09979498 212299.29941335, 161177.44718698 212299.33333335, 161120.17633894 212265.64232532, 161117.56142694 212260.76846932, 161116.00033893 212255.48296532, 161114.33013093 212251.16654931, 161094.47560292 212215.89243729, 161126.20827495 212188.88558927, 161134.88161895 212185.71592527, 161155.68385896 212173.54862926, 161159.50958697 212171.90786126, 161161.15457897 212170.49544526, 161163.44955497 212169.01435726, 161164.32494697 212165.10280526, 161164.48328297 212162.31176525, 161163.84174697 212157.13877325, 161164.75221097 212155.95643725, 161164.93704297 212153.82907725, 161162.30293097 212150.97518925, 161162.02721897 212148.16750924, 161163.17115497 212146.32686924, 161162.07003497 212142.38914124, 161214.410771 212117.61026122, 161216.702355 212116.52526922, 161224.02869101 212113.05698122, 161224.97845101 212135.39413324)))
const mapProjection = map.getView().getProjection();
const zonePanelRef = ref<HTMLElement>();
const panelOpen = ref(false);
const selectPerceel = ref(props.selectPerceel);
const activeDrawType = ref<IDrawGeomType>();
const geometryObjectList = ref<string[]>([]);
const addingWKT = ref(false);
const invalidWKT = ref(false);
let circleIndex = 1;
let polygonIndex = 1;
const geoJsonFormatter = new GeoJSON({
  dataProjection: mapProjection,
  featureProjection: mapProjection,
});
const drawLayer = _createVectorLayer({
  color: 'rgb(39, 146, 195)',
  fill: 'rgba(39, 146, 195, 0.3)',
  title: 'Zone',
});
drawLayer.getSource()?.on('addfeature', () => {
  drawLayerToZone();
});
map.addLayer(drawLayer);
addZoneToDrawLayer();

watch(zone, (newZone) => emit('update:zone', newZone));
watch(selectPerceel, (newSelectPerceel) => emit('update:select-perceel', newSelectPerceel));
watch(
  () => props.drawPanelEnabled,
  (isEnabled) => {
    if (!isEnabled) {
      resetSelect();
      toggleDrawZone(false);
    }
  }
);

onMounted(() => {
  emit('zone-panel:mounted', elementRef.value);
});

onUnmounted(() => {
  map
    .getControls()
    .getArray()
    .filter((control) => control['element'].classList.contains('zone-panel'))
    .forEach((control) => map.removeControl(control));
});

const perceelSelectCallback = (evt: MapBrowserEvent<UIEvent>) => {
  crabService.searchPerceel(evt.coordinate, mapProjection.getCode()).then((result) => {
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
  invalidWKT.value = false;
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
  addingWKT.value = false;
  map.getInteractions().pop();
  activeDrawType.value = drawZoneEnabled ? type : undefined;
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
    invalidWKT.value = false;
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
    invalidWKT.value = true;
    console.error(error, 'Dit is een ongeldige WKT geometrie.');
  }
}

function zoomToFeatures() {
  const extent = drawLayer.getSource()?.getExtent();
  if (!extent) return;

  zoomToExtent(extent);
}

function showWktInput() {
  toggleDrawZone(false);
  addingWKT.value = true;
  invalidWKT.value = false;
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
  if (!zone.value) {
    zone.value = contour;
  } else {
    zone.value.coordinates = contour.coordinates;
  }
}

function formatGeoJson(feature: Geometry) {
  const geojson = geoJsonFormatter.writeGeometryObject(feature) as Contour;
  // hack to add crs. todo: remove when https://github.com/openlayers/ol3/issues/2078 is fixed
  geojson.crs = {
    type: 'name',
    properties: {
      name: 'urn:ogc:def:crs:EPSG::31370',
    },
  };
  return geojson as Contour;
}

function addZoneToDrawLayer() {
  if (!drawLayer) return;

  const drawSource = drawLayer.getSource() as VectorSource<Geometry>;
  drawSource.getFeatures().forEach((feature) => {
    drawSource.removeFeature(feature);
  });
  geometryObjectList.value = [];

  if (!zone.value) return;
  const coordinates = zone.value.type === 'Polygon' ? [zone.value.coordinates] : zone.value.coordinates;

  for (const [index, coords] of coordinates.entries()) {
    const name = coordinates.length > 1 ? `Zone feature ${index + 1}` : 'Zone';
    const geometry = new Polygon(coords);
    drawSource.addFeature(new Feature({ name, geometry }));
    geometryObjectList.value.push(name);
  }
  zoomToExtent(geoJsonFormatter.readGeometry(zone.value).getExtent());
}
</script>

<style lang="scss" scoped>
@import 'pyoes/scss/base-variables';

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
  border: solid 2px $primary-color;
  border-radius: 2px;

  .oe-ol-control {
    display: none;
  }

  .pointer {
    cursor: pointer;
  }

  .panelHeader {
    flex: 0;
    color: white;
    margin: 0;
    padding: 0.25em 0.5em;
    background-color: $primary-color;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .panelBody {
    flex: 1;
    overflow: auto;
    padding: 10px;
  }

  &.closed {
    display: None;
  }

  .geometryObjectList {
    li {
      display: flex;
      align-items: end;
      span {
        flex: 1;
      }
      .iconLink {
        color: $primary-color;
      }
    }
  }
}

.vl-input-group.zone-input-group {
  margin-top: 0.2em;
  margin-bottom: 0.5em;
  .vl-button {
    flex: 1;
    display: flex;
    justify-content: center;
    &:not(:first-child):not(:last-child) {
      border-radius: 0;
      margin-left: 0;
      border-right: 0;
    }
    &:last-child {
      flex: 0;
      border-bottom-left-radius: 0;
      border-top-left-radius: 0;
      margin-left: 0;
    }
  }
}
</style>
