<template>
  <div ref="elementRef" class="layerswitcher oe-ol-control ol-control ol-unselectable">
    <button ref="buttonRef" class="layerswitcherButton" @click="togglePanel"></button>
  </div>

  <div ref="layerswitcherPanelRef" v-click-outside="hidePanel" class="panel hidden">
    <vl-title class="panelHeader" tag-name="h4">Legende</vl-title>
    <div class="panelBody">
      <template v-for="(layer, index) in overlayLayersRef" :key="layer.get('id') + layer.get('visible')">
        <vl-checkbox
          :checked="layer.getVisible()"
          :name="'checkbox-overlayLayer-' + index"
          mod-block
          @input="toggleVisibility(layer)"
        >
          {{ layer.get('title') }}
        </vl-checkbox>
        <ul v-if="layer.getVisible() && layer.get('legendImages')">
          <li v-for="(legendImage, index2) in layer.get('legendImages')" :key="index2" class="legendImage">
            <img :src="legendImage.url" :alt="legendImage.title" />
            <div class="vl-checkbox__label">&nbsp;{{ legendImage.title }}</div>
          </li>
        </ul>
      </template>
      <p class="achtergrondTitle">
        <strong> {{ achtergrondTitleRef }}</strong>
      </p>
      <vl-radio
        v-for="(layer, index) in achtergrondLayersRef"
        :id="'radio-achtergrondLayer-' + index"
        :key="index"
        v-model="selectedAchtergrondLayerRef"
        :name="'radio-achtergrondLayer-' + index"
        :value="layer.get('id')"
        mod-block
      >
        {{ layer.get('title') }}
      </vl-radio>
    </div>
  </div>
</template>

<script setup lang="ts">
import 'ol/ol.css';
import { VlCheckbox, VlRadio, VlTitle } from '@govflanders/vl-ui-design-system-vue3';
import { Group } from 'ol/layer';
import { inject, onMounted, onUnmounted, ref, watch } from 'vue';
import { vClickOutside } from '@directives/click-outside.directive';
import type Map from 'ol/Map';
import type BaseLayer from 'ol/layer/Base';
import type { Ref } from 'vue';

const buttonRef = ref<HTMLElement>();
const elementRef = ref<HTMLElement>();
const layerswitcherPanelRef = ref<HTMLElement>();
const achtergrondLayersRef = ref<BaseLayer[]>([]) as Ref<BaseLayer[]>;
const overlayLayersRef = ref<BaseLayer[]>([]) as Ref<BaseLayer[]>;
const selectedAchtergrondLayerRef = ref<string>();
const achtergrondTitleRef = ref('Achtergrond');
const map = inject('map') as Map;
let layers: BaseLayer[] = [];
const emit = defineEmits(['layerswitcher:mounted']);

onMounted(() => {
  emit('layerswitcher:mounted', elementRef.value);
});

onUnmounted(() => {
  map
    .getControls()
    .getArray()
    .filter((control) => control['element'].classList.contains('layerswitcher'))
    .forEach((control) => map.removeControl(control));
});

watch(selectedAchtergrondLayerRef, (layerId, oldLayerId) => {
  achtergrondLayersRef.value.find((l) => l.get('id') === layerId)?.setVisible(true);
  achtergrondLayersRef.value.find((l) => l.get('id') === oldLayerId)?.setVisible(false);
});

function setupPanel() {
  const achtergrondGroup = map.getLayers().getArray()[0];
  achtergrondTitleRef.value = achtergrondGroup?.get('title') || achtergrondTitleRef.value;
  layers = getLeafLayers(map).reverse();
  achtergrondLayersRef.value = layers.filter((l) => l.get('type') === 'base');
  overlayLayersRef.value = layers.filter((l) => l.get('type') === 'overlay');
  setVisibleLayers();
}

function setVisibleLayers() {
  const visibleAchtergrondLayers = achtergrondLayersRef.value.filter((l) => l.getVisible());
  selectedAchtergrondLayerRef.value = visibleAchtergrondLayers.reverse().pop()?.get('id');
  visibleAchtergrondLayers.forEach((layer) => layer.setVisible(false));
}

function toggleVisibility(layer: BaseLayer, isAchtergrondLayer = false) {
  layer.setVisible(!layer?.getVisible());
  if (isAchtergrondLayer) {
    achtergrondLayersRef.value.forEach((l) => l.setVisible(l === layer));
  }
}

function hidePanel(target?: HTMLElement) {
  if (target === buttonRef.value) return;
  layerswitcherPanelRef.value?.classList.add('hidden');
}

function togglePanel() {
  const classList = layerswitcherPanelRef.value?.classList;
  if (classList?.contains('hidden')) {
    setupPanel();
    classList?.remove('hidden');
  } else {
    classList?.add('hidden');
  }
}

function getLeafLayers(parent: Map | Group | undefined): BaseLayer[] {
  if (!parent) return [];
  layers = parent
    .getLayers()
    .getArray()
    .flatMap((layer) => (layer instanceof Group ? getLeafLayers(layer) : layer));
  layers.forEach((layer, index) => layer.set('id', `${layer.get('type')}_${index}`));
  return layers;
}
</script>

<style lang="scss" scoped>
.layerswitcherButton {
  background-image: url('data:image/svg+xml,<svg fill="%23944EA1" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M264.5 5.2c14.9-6.9 32.1-6.9 47 0l218.6 101c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 149.8C37.4 145.8 32 137.3 32 128s5.4-17.9 13.9-21.8L264.5 5.2zM476.9 209.6l53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 277.8C37.4 273.8 32 265.3 32 256s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0l152-70.2zm-152 198.2l152-70.2 53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 405.8C37.4 401.8 32 393.3 32 384s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0z"/></svg>');
}

.panel {
  margin: 0.5em;
  max-height: calc(100% - 1em);
  width: 350px;
  display: flex;
  flex-direction: column;
  z-index: 2;
  position: absolute;
  top: 0;
  left: 2em;
  overflow: hidden;
  background-color: rgba(white, 0.9);
  border: solid 2px var(--ol-subtle-foreground-color);
  border-radius: 2px;

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
    .achtergrondTitle {
      margin-top: 0.5em;
    }
    .legendImage {
      display: flex;
      align-items: center;
      img {
        float: left;
        margin-left: 1.5em;
      }
    }
  }

  &.hidden {
    display: none;
  }
}
</style>
