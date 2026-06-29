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
        ref="zonePanelRef"
        v-model:feature-select="featureSelect"
        :feature-select-config="featureSelectConfig"
        :max-zones="props.maxZones"
        :draw-panel-enabled="props.drawPanelEnabled"
        @zone-panel:mounted="addZonePanelControl"
        @zone-limit-reached="onZoneLimitReached"
      />
    </template>
  </OeMap>
</template>

<script setup lang="ts">
import { FeatureSelectEnum } from '../models/feature-select.enum';
import {
  OeZoneerderProps,
  ZoneLimitReachedEventDetail,
  defaultControlConfig,
  defaultFeatureSelectConfig,
  defaultLayerConfig,
} from '../models/map-config';
import { Contour } from '../models/openlayers';
import OeMap from './OeMap.vue';
import OeZoneerderZonePanel from './OeZoneerderZonePanel.vue';
import { Control } from 'ol/control';
import { Ref, computed, ref, useTemplateRef, watch } from 'vue';

const props = withDefaults(defineProps<OeZoneerderProps>(), {
  controlConfig: () => defaultControlConfig,
  layerConfig: () => defaultLayerConfig,
  featureSelectConfig: () => defaultFeatureSelectConfig,
  api: 'https://geo.onroerenderfgoed.be/',
  drawPanelEnabled: false,
  zone: undefined,
  maxZones: undefined,
});
const emit = defineEmits(['update:zone', 'zone-limit-reached']);
const zone = ref<Contour | undefined>(props.zone);
const rightControlsContainerRef = ref<HTMLElement>() as Ref<HTMLElement>;

const featureSelect = ref<FeatureSelectEnum>();
const featureSelectConfig = computed(() => ({
  ...defaultFeatureSelectConfig,
  ...props.featureSelectConfig,
}));
const mapRef = useTemplateRef('oeMap');
const zonePanelRef = useTemplateRef('zonePanelRef');

const addZonePanelControl = (element: HTMLElement) => {
  mapRef.value?.map?.addControl(new Control({ element, target: rightControlsContainerRef.value }));
};

const onZoneLimitReached = (payload: ZoneLimitReachedEventDetail) => {
  emit('zone-limit-reached', payload);
};

const resetZones = () => {
  zonePanelRef.value?.resetZones();
};

defineExpose({ resetZones });

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
