<template>
  <div
    data-cy="layerswitcherPanel"
    ref="layerswitcherPanelRef"
    v-click-outside="hidePanel"
    class="panel"
    :class="{ closed: !panelVisible }"
  >
    <div ref="elementRef" class="layerswitcher oe-ol-control ol-control ol-unselectable">
      <button ref="buttonRef" @click="togglePanel" title="Verander kaartlagen">
        <font-awesome-icon :icon="['fas', 'layer-group']" style="pointer-events: none" />
      </button>
    </div>

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
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
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
const panelVisible = ref(false);

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
  panelVisible.value = false;
}

function togglePanel() {
  if (!panelVisible.value) {
    setupPanel();
  }
  panelVisible.value = !panelVisible.value;
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

  .oe-ol-control {
    display: none;
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

  &.closed {
    display: none;
  }
}
</style>
