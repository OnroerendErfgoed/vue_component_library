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
      <zone-panel
        v-model:zone="zone"
        v-model:feature-select="featureSelect"
        :feature-select-config="props.featureSelectConfig"
        :draw-panel-enabled="props.drawPanelEnabled"
        @zone-panel:mounted="addZonePanelControl"
      ></zone-panel>
    </template>
  </OeMap>
</template>

<!--suppress CommaExpressionJS -->
<script setup lang="ts">
import 'ol/ol.css';
import { Control } from 'ol/control';
import { Ref, provide, ref, useTemplateRef, watch } from 'vue';
import { defaultControlConfig, defaultFeatureSelectConfig, defaultLayerConfig } from '@/models';
import OeMap from '@components/dumb/OeMap.vue';
import ZonePanel from '@components/smart/OeZoneerderZonePanel.vue';
import { FeatureSelectEnum } from '@models/featureSelect.enum';
import type { OeZoneerderProps } from '@/models';
import type { Contour } from '@models/oe-openlayers';

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
provide('map', mapRef.value?.map);
provide('crabService', mapRef.value?.crabService);
provide('zoomToExtent', mapRef.value?.zoomToExtent);

function addZonePanelControl(element: HTMLElement) {
  mapRef.value?.map?.addControl(new Control({ element, target: rightControlsContainerRef.value }));
}

watch(zone, (newZone) => emit('update:zone', newZone));
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
