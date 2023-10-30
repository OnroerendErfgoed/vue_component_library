<template>
  <div>
    <font-awesome-icon
      title="Details van de actor bekijken"
      class="icon vl-u-spacer-right--xxsmall"
      :icon="['fas', 'eye']"
      @click="props.params.setStateDetail()"
    />
    <a :href="`${props.params.actorenUrl}/beheer#/${params.data?.id}`" target="_blank" title="Bewerk actor">
      <font-awesome-icon class="icon" :icon="['fas', 'pencil']" />
    </a>
  </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type { ICellRendererParams } from 'ag-grid-community';
import type { IActor } from '@models/actor';

interface IOeActorWidgetGridActiesProps<T> extends ICellRendererParams<T> {
  setStateDetail: () => void;
  actorenUrl: string;
}
const props = defineProps<{ params: IOeActorWidgetGridActiesProps<IActor> }>();
</script>

<style lang="scss" scoped></style>
