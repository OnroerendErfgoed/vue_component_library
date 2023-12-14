<template>
  <vl-properties class="vl-grid" mod-collapsed>
    <div class="vl-col--1-1 vl-u-flex vl-u-flex-align-flex-end">
      <vl-button
        icon="arrow-left"
        mod-icon-before
        mod-naked
        data-cy="actor-widget-detail-back-btn"
        @click="emit('setStateGrid')"
        >Terug</vl-button
      >
    </div>
    <div class="vl-col--2-4">
      <vl-properties-list>
        <vl-properties-label>{{ actor?.type.id === 1 ? 'Naam' : 'Naam organisatie' }}</vl-properties-label>
        <vl-properties-data>{{ actor?.naam }}</vl-properties-data>
        <template v-if="actor?.type.id === 1">
          <vl-properties-label>Voornaam</vl-properties-label>
          <vl-properties-data>{{ actor.voornaam }}</vl-properties-data>
        </template>
        <vl-properties-label>Email adressen</vl-properties-label>
        <vl-properties-data>
          <ul>
            <li v-for="(email, index) in props.actor.emails" :key="index">
              <small>{{ email.email }} ({{ email.type.naam }})</small>
            </li>
          </ul>
        </vl-properties-data>
        <vl-properties-label>Telefoonnummers</vl-properties-label>
        <vl-properties-data>
          <ul>
            <li v-for="(telefoon, index) in props.actor.telefoons" :key="index">
              <small>{{ telefoon.volledig_nummer }} ({{ telefoon.type.naam }})</small>
            </li>
          </ul>
        </vl-properties-data>
      </vl-properties-list>
    </div>
    <div class="vl-col--2-4">
      <vl-properties-list>
        <vl-properties-label>Actortype</vl-properties-label>
        <vl-properties-data>{{ actor?.type.naam }}</vl-properties-data>
        <vl-properties-label>Adressen</vl-properties-label>
        <vl-properties-data>
          <ul>
            <li v-for="(adres, index) in props.actor.adressen" :key="index">
              <small>{{ adres.omschrijving }} ({{ adres.adrestype?.naam }})</small>
            </li>
          </ul>
        </vl-properties-data>
        <vl-properties-label>URL's</vl-properties-label>
        <vl-properties-data>
          <ul>
            <li v-for="(url, index) in props.actor.urls" :key="index">
              <small>{{ url.url }} ({{ url.type.naam }})</small>
            </li>
          </ul>
        </vl-properties-data>
      </vl-properties-list>
    </div>
  </vl-properties>
</template>

<script setup lang="ts">
import {
  VlButton,
  VlProperties,
  VlPropertiesData,
  VlPropertiesLabel,
  VlPropertiesList,
} from '@govflanders/vl-ui-design-system-vue3';
import type { IActor } from '@models/actor';

const props = withDefaults(defineProps<{ actor: IActor }>(), {
  actor: undefined,
});
const emit = defineEmits<{
  setStateGrid: [void];
}>();
</script>

<style lang="scss" scoped>
@import 'pyoes/scss/base-variables';
.vl-button {
  color: $primary-color;
}
</style>
