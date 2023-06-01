<template>
  <ul data-cy="systemfield-ul">
    <li data-cy="systemfield-status"><span>Status:</span> {{ props.status || '-' }}</li>
    <li data-cy="systemfield-aangemaakt-door">
      <span>Aangemaakt door:</span> {{ props.createdBy || '-' }} op {{ createdAt }}
    </li>
    <li v-if="props.updatedBy" data-cy="systemfield-laatst-bewerkt">
      <span>Laatst bewerkt door:</span> {{ props.updatedBy }} op {{ updatedAt }}
    </li>
    <slot></slot>
  </ul>
</template>

<script setup lang="ts">
import type { ISystemFieldsProps } from '@models/system-fields';
import { computed } from 'vue';

const props = defineProps<ISystemFieldsProps>();
const createdAt = computed(() => (props.createdAt ? formatDate(props.createdAt) : '-'));
const updatedAt = computed(() => (props.updatedAt ? formatDate(props.updatedAt) : '-'));

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    const options1: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };

    const options2: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
    };

    return (
      new Intl.DateTimeFormat('nl-BE', options1).format(date) +
      ' om ' +
      new Intl.DateTimeFormat('nl-BE', options2).format(date)
    );
  } catch {
    return '-';
  }
};
</script>

<style lang="scss" scoped>
@import 'pyoes/scss/pyoes-settings';

ul {
  font-family: $font-family-sans-serif;
  color: $dark-purple;
  margin: 20px 0 0 0;
  font-size: 0.6em;
  line-height: 1.6em;

  li {
    list-style-type: none;
  }
}
</style>
