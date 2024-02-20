<template>
  <div class="vl-u-spacer-bottom">
    <template v-if="props.waarnemingen?.length > 0">
      <h5 class="vl-title vl-title--h5" data-cy="gekoppelde-waarnemingen-title">Gekoppelde waarnemingen</h5>
      <a
        v-for="waarneming of props.waarnemingen"
        :key="waarneming.id"
        class="vl-u-display-block"
        target="_blank"
        :data-cy="'waarneming-link-' + waarneming.id"
        :href="waarneming.uri"
        >{{ waarneming.naam }} ({{ waarneming.id }})</a
      >
    </template>
    <template v-else>
      <span data-cy="geen-gekoppelde-waarnemingen">Geen gekoppelde waarnemingen beschikbaar.</span>
    </template>
  </div>
  <div class="vl-u-spacer-bottom">
    <template v-if="props.gebeurtenissen?.length > 0">
      <h5 class="vl-title vl-title--h5" data-cy="gekoppelde-gebeurtenissen-title">Gekoppelde gebeurtenissen</h5>
      <a
        v-for="gebeurtenis of props.gebeurtenissen"
        :key="gebeurtenis.id"
        class="vl-u-display-block"
        target="_blank"
        :href="gebeurtenis.uri"
        :data-cy="'gebeurtenis-link-' + gebeurtenis.id"
        >{{ gebeurtenis.titel }} ({{ gebeurtenis.id }})</a
      >
    </template>
    <template v-else>
      <span data-cy="geen-gekoppelde-gebeurtenissen">Geen gekoppelde gebeurtenissen beschikbaar.</span>
    </template>
  </div>
</template>
<script setup lang="ts">
import type { IInventarisLinkGebeurtenis, IInventarisLinkWaarneming } from '@models/links';

interface IOeInventarisLoadedLink {
  gebeurtenissen: IInventarisLinkGebeurtenis[];
  waarnemingen: IInventarisLinkWaarneming[];
}

const props = withDefaults(defineProps<IOeInventarisLoadedLink>(), {
  waarnemingen: undefined,
  gebeurtenissen: undefined,
});
</script>
