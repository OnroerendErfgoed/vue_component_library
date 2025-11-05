<template>
  <div>
    <FontAwesomeIcon
      data-cy="actor-widget-detail-btn"
      title="Details van de actor bekijken"
      class="icon vl-u-spacer-right--xxsmall"
      :icon="faEye"
      @click="props.params.setStateDetail(params.data?.id as number)"
    />
    <a
      :href="`${props.params.actorenUrl}/beheer/${params.data?.id}?editMode=true`"
      target="_blank"
      title="Bewerk actor"
    >
      <FontAwesomeIcon class="icon" :icon="faPencil" />
    </a>
  </div>
</template>

<script setup lang="ts">
import { faEye, faPencil } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type { ICellRendererParams } from 'ag-grid-community';
import type { IActor } from '@models/actor';

interface IOeActorWidgetGridActiesProps<T> extends ICellRendererParams<T> {
  setStateDetail: (id: number) => void;
  actorenUrl: string;
}
const props = defineProps<{ params: IOeActorWidgetGridActiesProps<IActor> }>();
</script>
