<template>
  <VlProperties mod-collapsed>
    <VlGrid>
      <VlColumn width="12" class="vl-u-flex vl-u-flex-align-flex-end">
        <VlButton
          icon="arrow-left"
          mod-icon-before
          mod-naked
          data-cy="actor-widget-detail-back-btn"
          @click="emit('setStateGrid')"
          >Terug</VlButton
        >
      </VlColumn>
      <VlColumn width="6">
        <VlPropertiesList>
          <VlPropertiesLabel>{{ actor?.type.id === 1 ? 'Naam' : 'Naam organisatie' }}</VlPropertiesLabel>
          <VlPropertiesData>{{ actor?.naam }}</VlPropertiesData>
          <template v-if="actor?.type.id === 1">
            <VlPropertiesLabel>Voornaam</VlPropertiesLabel>
            <VlPropertiesData>{{ actor.voornaam }}</VlPropertiesData>
          </template>
          <VlPropertiesLabel>Email adressen</VlPropertiesLabel>
          <VlPropertiesData>
            <ul>
              <li v-for="(email, index) in props.actor.emails" :key="index">
                <small>{{ email.email }} ({{ email.type.naam }})</small>
              </li>
            </ul>
          </VlPropertiesData>
          <VlPropertiesLabel>Telefoonnummers</VlPropertiesLabel>
          <VlPropertiesData>
            <ul>
              <li v-for="(telefoon, index) in props.actor.telefoons" :key="index">
                <small>{{ telefoon.volledig_nummer }} ({{ telefoon.type.naam }})</small>
              </li>
            </ul>
          </VlPropertiesData>
        </VlPropertiesList>
      </VlColumn>
      <VlColumn width="6">
        <VlPropertiesList>
          <VlPropertiesLabel>Actortype</VlPropertiesLabel>
          <VlPropertiesData>{{ actor?.type.naam }}</VlPropertiesData>
          <VlPropertiesLabel>Adres</VlPropertiesLabel>
          <VlPropertiesData>
            <small>{{ props.actor?.adres?.omschrijving }}</small>
          </VlPropertiesData>
          <VlPropertiesLabel>URL's</VlPropertiesLabel>
          <VlPropertiesData>
            <ul>
              <li v-for="(url, index) in props.actor.urls" :key="index">
                <small>{{ url.url }} ({{ url.type.naam }})</small>
              </li>
            </ul>
          </VlPropertiesData>
        </VlPropertiesList>
      </VlColumn>
    </VlGrid>
  </VlProperties>
</template>

<script setup lang="ts">
import {
  VlButton,
  VlColumn,
  VlGrid,
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
@import '@OnroerendErfgoed/pyoes/scss/base-variables';
.vl-button {
  color: $primary-color;
}
</style>
