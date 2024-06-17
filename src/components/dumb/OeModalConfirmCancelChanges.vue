<template>
  <vl-modal id="confirm-cancel-changes-modal">
    <oe-loader v-if="isLoading" />

    <h2 class="vl-title vl-title--h2 vl-modal-dialog__title">
      Ben je zeker dat je deze wijzigingen niet wilt bewaren?
    </h2>
    <div class="vl-u-spacer-bottom">
      <p class="vl-u-spacer-bottom">
        Bij het sluiten van deze fiche zullen je onbewaarde wijzigingen verloren gaan. Zorg ervoor dat je eerst je
        wijzigingen bewaart, alvorens deze pagina te verlaten.
      </p>
    </div>
    <div class="vl-u-flex vl-u-flex-align-center">
      <vl-button class="vl-button vl-u-spacer-right" @click="emit('confirm')">Ja, annuleer mijn wijzigingen</vl-button>
      <vl-button class="vl-button large" @click="emit('close')">Nee, behoud mijn wijzigingen</vl-button>
    </div>
  </vl-modal>
</template>

<script setup lang="ts">
import { VlButton, VlModal } from '@govflanders/vl-ui-design-system-vue3';
import { storeToRefs } from 'pinia';
import { useUtilStore } from '@/composables';
import { OeLoader } from '@components/dumb';

const emit = defineEmits(['confirm', 'close']);

const utilStore = useUtilStore();
const { isLoading } = storeToRefs(utilStore);
</script>
