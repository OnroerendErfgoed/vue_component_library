<template>
  <div ref="zonePanelRef" :class="{ closed: !panelOpen || !props.drawPanelEnabled }" class="panel">
    <div ref="elementRef" class="zone-panel oe-ol-control ol-control ol-unselectable">
      <button data-cy="zonePanelControl" @click="togglePanel">
        <FontAwesomeIcon :icon="faPencil" title="Zone samenstellen" />
      </button>
    </div>

    <VlTitle class="panelHeader" tag-name="h4">
      <span v-if="panelOpen" class="titleText">&nbsp;Zone samenstellen</span>
      <FontAwesomeIcon class="pointer" :icon="faClose" @click="togglePanel" />
    </VlTitle>

    <div v-if="panelOpen" class="panelBody">
      <VlInputGroup class="zone-input-group">
        <template v-if="!addingWKT">
          <VlButton
            mod-narrow
            :mod-secondary="!(activeDrawType === 'Polygon')"
            title="Teken polygoon"
            @click="toggleDrawZone(true)"
          >
            <FontAwesomeIcon :icon="faDrawPolygon" />
          </VlButton>
          <VlButton
            mod-narrow
            :mod-secondary="!(activeDrawType === 'Circle')"
            title="Teken cirkel"
            @click="toggleDrawZone(true, 'Circle')"
          >
            <FontAwesomeIcon :icon="faCircle" />
          </VlButton>
          <VlButton
            v-if="props.featureSelectConfig.perceel"
            data-cy="selectPerceelButton"
            vl-button
            mod-narrow
            :mod-secondary="featureSelect !== FeatureSelectEnum.Perceel"
            title="Selecteer perceel"
            @click="startPerceelSelect()"
          >
            <FontAwesomeIcon :icon="faMapMarkedAlt" />
          </VlButton>
          <VlButton
            v-if="props.featureSelectConfig.gebouw"
            data-cy="selectGebouwButton"
            vl-button
            mod-narrow
            :mod-secondary="featureSelect !== FeatureSelectEnum.Gebouw"
            title="Selecteer gebouw"
            @click="startGebouwSelect()"
          >
            <FontAwesomeIcon :icon="faBuilding" />
          </VlButton>
          <VlButton
            v-if="props.featureSelectConfig.kunstwerk"
            data-cy="selectKunstwerkButton"
            vl-button
            mod-narrow
            :mod-secondary="featureSelect !== FeatureSelectEnum.Kunstwerk"
            title="Selecteer kunstwerk"
            @click="startKunstwerkSelect()"
          >
            <FontAwesomeIcon :icon="faMonument" />
          </VlButton>
          <VlButton data-cy="showWKTInput" vl-button mod-narrow mod-secondary title="WKT string" @click="showWktInput()"
            >WKT</VlButton
          >
        </template>
        <template v-else>
          <VlInputField
            id="map-address"
            data-cy="WKTInput"
            name="map-address"
            placeholder="WKT string (Lambert72)"
            mod-block
            :mod-error="invalidWKT"
            :model-value="WKTString"
            @update:model-value="updateWKTString"
          />
          <VlButton data-cy="plaatsWKT" vl-button mod-narrow mod-secondary @click="drawWKTZone()">Plaats</VlButton>
        </template>
        <VlButton title="annuleren" vl-button mod-narrow mod-secondary @click="toggleDrawZone(false)">
          <FontAwesomeIcon :icon="faCancel" />
        </VlButton>
      </VlInputGroup>

      <p><strong>Toegevoegde zones</strong></p>
      <ul data-cy="geometryObjectList" class="geometryObjectList">
        <li v-for="(item, index) in geometryObjectList" :key="index">
          <span>{{ item }}</span>
          <vl-link class="iconLink" title="Flash deze polygoon" data-cy="flashFeatureBtn" @click="flashFeature(item)">
            <FontAwesomeIcon :icon="faBoltLightning" />
          </vl-link>
          <vl-link
            class="iconLink"
            title="Zoom naar deze polygoon"
            data-cy="zoomFeatureBtn"
            @click="zoomToFeature(item)"
          >
            <FontAwesomeIcon :icon="faMagnifyingGlass" />
          </vl-link>
          <vl-link
            class="iconLink"
            title="Verwijder deze polygoon"
            data-cy="deleteFeatureBtn"
            @click="removeGeometryObject(item)"
          >
            <FontAwesomeIcon :icon="faTrashCan" />
          </vl-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import 'ol/ol.css';
import { FeatureSelectEnum } from '../models/feature-select.enum';
import { FeatureSelectConfig } from '../models/map-config';
import { IDrawGeomType } from '../models/openlayers';
import { MapUtil } from '../utils/openlayers/map-util';
import {
  faBoltLightning,
  faBuilding,
  faCancel,
  faCircle,
  faClose,
  faDrawPolygon,
  faMagnifyingGlass,
  faMapMarkedAlt,
  faMonument,
  faPencil,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { VlButton, VlInputField, VlInputGroup, VlLink, VlTitle } from '@govflanders/vl-ui-design-system-vue3';
import Map from 'ol/Map';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import { unByKey } from 'ol/Observable';
import { type Extent } from 'ol/extent';
import { GeoJSON, WKT } from 'ol/format';
import { Geometry, Point } from 'ol/geom';
import { Draw } from 'ol/interaction';
import VectorSource from 'ol/source/Vector';
import { inject, onMounted, onUnmounted, ref, watch } from 'vue';
import type { CrabApiService } from '@services/crab-api.service';

const props = defineProps<{
  featureSelect: FeatureSelectEnum | undefined;
  featureSelectConfig: FeatureSelectConfig;
  drawPanelEnabled?: boolean;
}>();

const featureSelectEventKey = ref();
const elementRef = ref<HTMLElement>();
const emit = defineEmits(['update:feature-select', 'zone-panel:mounted']);

const map = inject('map') as Map;
const crabService = inject('crabService') as CrabApiService;
const geoJsonFormatter = inject('geoJsonFormatter') as GeoJSON;
const zoomToExtent = inject('zoomToExtent') as (extent: Extent) => void;

const WKTString = ref('');
// GEOMETRYCOLLECTION(POLYGON ((161224.97845101 212135.39413324, 161227.78030702 212146.77013324, 161227.79144301 212149.23784525, 161227.18613102 212151.84712525, 161227.10414701 212155.79176525, 161227.01077101 212160.28341325, 161226.58331501 212161.16456525, 161219.72001901 212172.48002126, 161216.50203501 212180.24232526, 161215.619987 212182.37000527, 161210.879955 212192.90005327, 161206.650003 212200.76994128, 161204.026451 212205.67893328, 161202.14997099 212209.18997329, 161196.13006699 212222.70997329, 161195.37025899 212224.6055893, 161192.23003499 212232.4400213, 161188.71995499 212238.6398933, 161183.70997098 212247.58997331, 161182.12635498 212250.23675732, 161178.01998698 212257.09998932, 161174.55829097 212262.74952532, 161173.01998697 212265.26005333, 161171.94997098 212268.24002133, 161171.87995498 212268.61000533, 161174.68001898 212277.42402133, 161179.16155498 212296.29506135, 161179.09979498 212299.29941335, 161177.44718698 212299.33333335, 161120.17633894 212265.64232532, 161117.56142694 212260.76846932, 161116.00033893 212255.48296532, 161114.33013093 212251.16654931, 161094.47560292 212215.89243729, 161126.20827495 212188.88558927, 161134.88161895 212185.71592527, 161155.68385896 212173.54862926, 161159.50958697 212171.90786126, 161161.15457897 212170.49544526, 161163.44955497 212169.01435726, 161164.32494697 212165.10280526, 161164.48328297 212162.31176525, 161163.84174697 212157.13877325, 161164.75221097 212155.95643725, 161164.93704297 212153.82907725, 161162.30293097 212150.97518925, 161162.02721897 212148.16750924, 161163.17115497 212146.32686924, 161162.07003497 212142.38914124, 161214.410771 212117.61026122, 161216.702355 212116.52526922, 161224.02869101 212113.05698122, 161224.97845101 212135.39413324)))
const mapProjection = map.getView().getProjection();
const zonePanelRef = ref<HTMLElement>();
const panelOpen = ref(false);
const featureSelect = ref(props.featureSelect);
const activeDrawType = ref<IDrawGeomType>();
const geometryObjectList = ref<string[]>([]);
const addingWKT = ref(false);
const invalidWKT = ref(false);
let circleIndex = 1;
let polygonIndex = 1;

const zoneLayer = MapUtil.getLayerById(map, 'zoneLayer');
const flashLayer = MapUtil.createVectorLayer({
  color: 'rgba(255,0,255, 1)',
  fill: 'rgba(255,0,255, 0.4)',
  title: '',
  id: 'flashLayer',
});
map.addLayer(flashLayer);

watch(featureSelect, (newFeatureSelect) => emit('update:feature-select', newFeatureSelect));
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
  zoneLayer
    .getSource()
    ?.getFeatures()
    .forEach((feature) => {
      geometryObjectList.value.push(feature.get('name'));
    });
});

onUnmounted(() => {
  map
    .getControls()
    .getArray()
    .filter((control) => control['element'].classList.contains('zone-panel'))
    .forEach((control) => map.removeControl(control));
  geometryObjectList.value = [];
});

const featureSelectCallback = (
  evt: MapBrowserEvent<UIEvent>,
  featureTypes: string[],
  type: FeatureSelectEnum,
  featureProp: string
) => {
  const geom = new Point(evt.coordinate, 'XY');
  crabService.searchGRBWfs(geom, mapProjection.getCode(), featureTypes).then((result) => {
    geoJsonFormatter.readFeatures(result).forEach((olFeature) => {
      if (olFeature) {
        const name = `${type} ${olFeature.get(featureProp)}`;
        if (geometryObjectList.value.indexOf(name) === -1) {
          olFeature.set('name', name);
          olFeature.set('show', true);
          if (zoneLayer.getSource()) {
            zoneLayer.getSource()?.addFeature(olFeature);
            geometryObjectList.value.push(name);
          }
        }
      } else {
        console.error(`Er werd geen ${type.toLowerCase()} gevonden op deze locatie.`);
      }
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
  featureSelect.value = undefined;
  if (featureSelectEventKey.value) {
    unByKey(featureSelectEventKey.value);
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
      show: true,
    });
    zoneLayer.getSource()?.addFeature(featureFromWKT);
    geometryObjectList.value.push(name);
    zoomToFeatures();
    WKTString.value = '';
  } catch (error) {
    invalidWKT.value = true;
    console.error(error, 'Dit is een ongeldige WKT geometrie.');
  }
}

function zoomToFeatures() {
  const extent = zoneLayer.getSource()?.getExtent();
  if (!extent) return;

  zoomToExtent(extent);
}

function zoomToFeature(featureName: string) {
  const feature = zoneLayer
    .getSource()
    ?.getFeatures()
    .find((feature) => feature.getProperties().name === featureName);
  const extent = feature?.getGeometry()?.getExtent();
  if (!extent) return;

  zoomToExtent(extent);
}

function showWktInput() {
  toggleDrawZone(false);
  addingWKT.value = true;
  invalidWKT.value = false;
}

function startSelect() {
  toggleDrawZone(false);
  resetSelect();
}

function startPerceelSelect() {
  startSelect();
  featureSelect.value = FeatureSelectEnum.Perceel;
  featureSelectEventKey.value = map.on('click', (e) =>
    featureSelectCallback(e, ['ADP'], FeatureSelectEnum.Perceel, 'CAPAKEY')
  );
}

function startGebouwSelect() {
  startSelect();
  featureSelect.value = FeatureSelectEnum.Gebouw;
  featureSelectEventKey.value = map.on('click', (e) =>
    featureSelectCallback(e, ['GBG'], FeatureSelectEnum.Gebouw, 'OIDN')
  );
}

function startKunstwerkSelect() {
  startSelect();
  featureSelect.value = FeatureSelectEnum.Kunstwerk;
  featureSelectEventKey.value = map.on('click', (e) =>
    featureSelectCallback(e, ['KNW'], FeatureSelectEnum.Kunstwerk, 'OIDN')
  );
}

function _createInteractions() {
  const drawInteractions = {
    Circle: new Draw({ type: 'Circle', source: zoneLayer.getSource() as VectorSource }),
    Polygon: new Draw({ type: 'Polygon', source: zoneLayer.getSource() as VectorSource }),
  };

  for (const [type, interaction] of Object.entries(drawInteractions)) {
    interaction.on('drawend', (evt) => {
      const name = type === 'Circle' ? `Cirkel ${circleIndex++}` : `Polygoon ${polygonIndex++}`;
      evt.feature.setProperties({ name, show: true });
      geometryObjectList.value.push(evt.feature.getProperties().name);
    });
    interaction.setActive(false);
  }
  return drawInteractions;
}

function removeGeometryObject(name: string) {
  const zoneSource = zoneLayer.getSource();
  const featuresToRemove = zoneSource?.getFeatures().filter((feature) => feature.getProperties().name === name);
  featuresToRemove?.forEach((featureToRemove) => {
    zoneSource?.removeFeature(featureToRemove);
  });

  geometryObjectList.value.splice(geometryObjectList.value.indexOf(name), 1);
}

function flashFeature(featureName: string) {
  if (!flashLayer || !zoneLayer) return;

  const flashSource = flashLayer.getSource() as VectorSource<Geometry>;
  const zoneSource = zoneLayer.getSource() as VectorSource<Geometry>;

  if (flashSource.getFeatures().find((feature) => feature.getProperties().name === featureName)) return;

  const featureToFlash = zoneSource.getFeatures().find((feature) => feature.getProperties().name === featureName);
  if (featureToFlash) {
    flashSource.addFeature(featureToFlash);
    setTimeout(() => {
      flashSource.removeFeature(featureToFlash);
    }, 1000);
  }
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
        margin-left: 0.2em;
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
