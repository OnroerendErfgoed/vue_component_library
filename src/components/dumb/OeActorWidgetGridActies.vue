<template>
  <div>
    <font-awesome-icon
      data-cy="actor-widget-detail-btn"
      title="Details van de actor bekijken"
      class="icon vl-u-spacer-right--xxsmall"
      icon="eye"
      @click="props.params.setStateDetail(params.data?.id as number)"
    />
    <a :href="`${props.params.actorenUrl}/beheer/${params.data?.id}`" target="_blank" title="Bewerk actor">
      <font-awesome-icon class="icon" icon="pencil" />
    </a>
  </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type { ICellRendererParams } from 'ag-grid-community';
import type { IActor } from '@models/actor';

interface IOeActorWidgetGridActiesProps<T> extends ICellRendererParams<T> {
  setStateDetail: (id: number) => void;
  actorenUrl: string;
}
const props = defineProps<{ params: IOeActorWidgetGridActiesProps<IActor> }>();
</script>
