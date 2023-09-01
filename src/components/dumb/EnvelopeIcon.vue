<template>
  <font-awesome-layers :class="'fa-' + layerHeight + 'x'">
    <font-awesome-icon icon="circle" :class="'circle fa-' + iconHeight + 'x'" />
    <font-awesome-icon icon="envelope" transform="shrink-6" :class="'envelope fa-' + iconHeight + 'x'" />
  </font-awesome-layers>
</template>
<script setup lang="ts">
import { FontAwesomeIcon, FontAwesomeLayers } from '@fortawesome/vue-fontawesome';
import type { IIconProps } from '@models/icon';

const props = withDefaults(defineProps<IIconProps>(), {
  layerHeight: 1,
  iconHeight: 2,
});
</script>
<style lang="scss" scoped>
@import 'pyoes/scss/pyoes-settings';

.circle {
  color: $success-color;
}

.envelope {
  color: $white;
}
</style>
