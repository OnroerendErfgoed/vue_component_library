<template>
  <OeModal id="confirm-cancel-changes-modal" title="Ben je zeker dat je deze wijzigingen niet wilt bewaren?">
    Bij het sluiten van deze fiche zullen je onbewaarde wijzigingen verloren gaan. Zorg ervoor dat je eerst je
    wijzigingen bewaart, alvorens deze pagina te verlaten.

    <template #modal-footer>
      <VlActionGroup mod-align-center>
        <VlButton data-cy="confirm-button" class="vl-button vl-u-spacer-right" @click="emit('confirm')"
          >Ja, annuleer mijn wijzigingen
        </VlButton>
        <VlButton data-cy="cancel-button" class="vl-button large" @click="emit('close')"
          >Nee, behoud mijn wijzigingen
        </VlButton>
      </VlActionGroup>
    </template>
  </OeModal>
</template>

<script setup lang="ts">
import OeModal from './OeModal.vue';
import { VlActionGroup, VlButton } from '@govflanders/vl-ui-design-system-vue3';

const emit = defineEmits(['confirm', 'close']);
</script>
