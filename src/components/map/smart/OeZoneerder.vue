<template>
  <OeMap
    ref="oeMap"
    v-model:zone="zone"
    :control-config="props.controlConfig"
    :layer-config="props.layerConfig"
    :api="props.api"
    :class="{ featureSelect: featureSelect }"
  >
    <template #rightControls>
      <div ref="rightControlsContainerRef" :class="{ hideZonePanelControl: !props.drawPanelEnabled }"></div>
    </template>
    <template #panel>
      <OeZoneerderZonePanel
        v-model:feature-select="featureSelect"
        :feature-select-config="props.featureSelectConfig"
        :draw-panel-enabled="props.drawPanelEnabled"
        @zone-panel:mounted="addZonePanelControl"
      />
    </template>
  </OeMap>
</template>

<script setup lang="ts">
import 'ol/ol.css';
import { FeatureSelectEnum } from '../models/feature-select.enum';
import {
  OeZoneerderProps,
  defaultControlConfig,
  defaultFeatureSelectConfig,
  defaultLayerConfig,
} from '../models/map-config';
import { Contour } from '../models/openlayers';
import OeMap from './OeMap.vue';
import OeZoneerderZonePanel from './OeZoneerderZonePanel.vue';
import { Control } from 'ol/control';
import { Ref, ref, useTemplateRef, watch } from 'vue';

const props = withDefaults(defineProps<OeZoneerderProps>(), {
  controlConfig: () => defaultControlConfig,
  layerConfig: () => defaultLayerConfig,
  featureSelectConfig: () => defaultFeatureSelectConfig,
  api: 'https://geo.onroerenderfgoed.be/',
  drawPanelEnabled: false,
  zone: undefined,
});
const emit = defineEmits(['update:zone']);
const zone = ref<Contour | undefined>(props.zone);
const rightControlsContainerRef = ref<HTMLElement>() as Ref<HTMLElement>;

const featureSelect = ref<FeatureSelectEnum>();
const mapRef = useTemplateRef('oeMap');

function addZonePanelControl(element: HTMLElement) {
  mapRef.value?.map?.addControl(new Control({ element, target: rightControlsContainerRef.value }));
}

watch(zone, (newZone) => emit('update:zone', newZone), { deep: true });
</script>

<style lang="scss">
.map.featureSelect canvas {
  cursor: pointer;
}

.hideZonePanelControl .oe-ol-control.zone-panel {
  display: none;
}

//right controls
.zone-panel.oe-ol-control {
  order: 1;
  button {
    width: 2.5em;
    height: 2.5em;
  }
}
</style>
