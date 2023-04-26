<template>
  <div class="address-crab">
    <VlProperties>
      <VlPropertiesTitle>Adres</VlPropertiesTitle>

      <VlPropertiesList>
        <!-- Land -->
        <VlPropertiesLabel>Land</VlPropertiesLabel>
        <VlPropertiesData>
          <VlSelect
            v-model:value="land"
            mod-block
            placeholder-text="Land"
          >
            <option
              v-for="item in landen"
              :key="item.id"
              :value="item.id"
              :disabled="item.disabled"
            >
              {{ item.naam }}
            </option>
          </VlSelect>
        </VlPropertiesData>

        <!-- Gemeente -->
        <VlPropertiesLabel>Gemeente</VlPropertiesLabel>
        <VlPropertiesData>
          <VlMultiselect
            v-if="isBelgiumOrEmpty"
            v-model="gemeente"
            placeholder="Gemeente"
            :disabled="!land"
            :mod-multiple="false"
            :options="gemeenten"
          >
            <option
              v-for="item in gemeenten"
              :key="item.id"
              :value="item.id"
              :disabled="item.disabled"
            >
              {{ item.naam }}
            </option>
          </VlMultiselect>

          <VlInputField
            v-else
            v-model="gemeente"
            mod-block
            placeholder="Gemeente"
          />
        </VlPropertiesData>

        <!-- Postcode -->
        <VlPropertiesLabel>Postcode</VlPropertiesLabel>
        <VlPropertiesData>
          <VlMultiselect
            v-if="isBelgiumOrEmpty"
            v-model="postcode"
            placeholder="Postcode"
            :disabled="!gemeente"
            :mod-multiple="false"
            :options="postcodes"
          />

          <VlInputField
            v-else
            v-model="postcode"
            mod-block
            placeholder="Postcode"
          />
        </VlPropertiesData>

        <!-- Straat -->
        <VlPropertiesLabel>Straat</VlPropertiesLabel>
        <VlPropertiesData>
          <VlMultiselect
            v-if="isBelgiumOrEmpty"
            v-model="straat"
            placeholder="Straat"
            :disabled="!gemeente"
            :mod-multiple="false"
            :options="straten"
          />

          <VlInputField
            v-else
            v-model="straat"
            mod-block
            placeholder="Straat"
          />
        </VlPropertiesData>

        <!-- Huisnummer -->
        <VlPropertiesLabel>Huisnummer</VlPropertiesLabel>
        <VlPropertiesData>
          <VlMultiselect
            v-if="isBelgiumOrEmpty"
            v-model="huisnummer"
            placeholder="Huisnummer"
            :disabled="!straat"
            :mod-multiple="false"
            :options="huisnummers"
          />

          <VlInputField
            v-else
            v-model="huisnummer"
            type="number"
            mod-block
            placeholder="Huisnummer"
          />
        </VlPropertiesData>

        <!-- Busnummer -->
        <VlPropertiesLabel>Busnr.</VlPropertiesLabel>
        <VlPropertiesData>
          <VlInputField
            v-model="busnummer"
            mod-block
            placeholder="Busnummer"
          />
        </VlPropertiesData>
      </VlPropertiesList>
    </VlProperties>

    <br>
    <p>Form selectie:</p>
    <br>
    <p>Land: {{ land }}</p>
    <p>Gemeente: {{ gemeente }}</p>
    <p>Postcode: {{ postcode }}</p>
    <p>Straat: {{ straat }}</p>
    <p>Huisnummer: {{ huisnummer }}</p>
    <p>Busnummer: {{ busnummer }}</p>
  </div>
</template>

<script setup lang="ts">
import { VlMultiselect, VlProperties, VlPropertiesData, VlPropertiesLabel, VlPropertiesList, VlPropertiesTitle, VlSelect, VlInputField } from '@govflanders/vl-ui-design-system-vue3';
import { computed, ref, watch } from 'vue';
import { CrabService } from '../../services/crab.api-service';
import type { Huisnummer } from '../../services/models/locatie';

// Form values
const land = ref('');
const gemeente = ref('');
const postcode = ref('');
const straat = ref('');
const huisnummer = ref('');
const busnummer = ref('');

const isBelgiumOrEmpty = computed(() => land.value === 'BE' || land.value === '');

// Reference data
const crabService = new CrabService();

const staticLanden = [
  { id: 'BE', naam: 'België' },
  { id: 'DE', naam: 'Duitsland' },
  { id: 'FR', naam: 'Frankrijk' },
  { id: 'GB', naam: 'Groot-Brittanië' },
  { id: 'NL', naam: 'Nederland' },
  { id: 'LU', naam: 'Luxemburg' },
  { id: 'divider', naam: '─────────────────────────', disabled: true }
];
const apiLanden = await crabService.getLanden();
const landen = computed(() => [...staticLanden, ...apiLanden])
const gemeenten = await crabService.getGemeenten()
const postcodes = ref([])
const straten = ref([])
const huisnummers = ref<Huisnummer[]>([])

// Gemeente side-effects
watch(gemeente, async (selectedGemeente: any) => {
  if (isBelgiumOrEmpty.value) {
    postcodes.value = await crabService.getPostcodes(selectedGemeente.id);
    straten.value = await crabService.getStraten(selectedGemeente.id);
  }
})

// Straat side-effects
watch(straat, async (selectedStraat: any) => {
  if (isBelgiumOrEmpty.value) {
    huisnummers.value = await crabService.getHuisnrs(selectedStraat.id);
  }
})
</script>

<style lang="scss" scoped>
.address-crab {
  div.placeholder-container {
    margin: 0;
    border: none;
  }

  .copy-button {
    margin-left: 5px;
  }

  .vl-properties__label {
    max-width: 100%;
  }
}
</style>
