<template>
  <ul data-cy="systemfield-ul">
    <li v-if="props.status" data-cy="systemfield-status">Status: {{ props.status }}</li>
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
import { computed } from 'vue';
import { ISystemFieldsProps } from '@/core';

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
      timeZone: 'Europe/Brussels',
    };

    const options2: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      timeZone: 'Europe/Brussels',
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
@import 'pyoes/scss/base-variables';

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
