<template>
  <OeMap>
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
import Map from 'ol/Map';
import { inject, provide, ref } from 'vue';
import { defaultControlConfig, defaultFeatureSelectConfig, defaultLayerConfig } from '@/models';
import { CrabApiService } from '@/services';
import OeMap from '@components/dumb/OeMap.vue';
import ZonePanel from '@components/smart/OeZoneerderZonePanel.vue';
import { FeatureSelectEnum } from '@models/featureSelect.enum';
import type { Extent } from 'ol/extent';
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
const zone = ref<Contour | undefined>(props.zone);

const map = inject('map') as Map;
const zoomToExtent = inject('zoomToExtent') as (extent: Extent) => void;
const crabService = inject('crabService') as CrabApiService;

const featureSelect = ref<FeatureSelectEnum>();

// const emit = defineEmits(['map:created', 'update:zone']);

provide('map', map);
provide('crabService', crabService);
provide('zoomToExtent', zoomToExtent);

function addZonePanelControl(element: HTMLElement) {
  console.log(element);
  // map?.addControl(new Control({ element, target: rightControlsContainerRef.value }));
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

  &.featureSelect canvas {
    cursor: pointer;
  }
}

.hideZonePanelControl .oe-ol-control.zone-panel {
  display: none;
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
.zone-panel.oe-ol-control {
  order: 1;
  button {
    width: 2.5em;
    height: 2.5em;
  }
}
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
