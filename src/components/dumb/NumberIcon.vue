<template>
  <font-awesome-layers :class="'fa-' + layerHeight + 'x'">
    <font-awesome-icon icon="circle" :class="'circle fa-' + iconHeight + 'x'" />
    <font-awesome-layers-text
      class="layer-text"
      transform="right-4"
      :style="{ fontSize: iconHeight + 'rem' }"
      :value="value"
    />
  </font-awesome-layers>
</template>
<script setup lang="ts">
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome';
import type { IIconProps } from '@models/icon';

const props = withDefaults(defineProps<IIconProps>(), {
  layerHeight: 1,
  iconHeight: 2,
  value: '1',
});
</script>
<style lang="scss" scoped>
@import 'pyoes/scss/pyoes-settings';

.circle {
  color: $info-color;
}

.layer-text {
  color: $white;
}
</style>
