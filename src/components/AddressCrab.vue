<template>
  <div class="address-crab">
    <!-- <select value.bind="data.land" disabled.bind="disabled">
            <option repeat.for="land of landen" value.bind="land.id">${land.naam}</option>
          </select> -->

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
            v-model="gemeente"
            placeholder="Gemeente"
            :mod-multiple="false"
            :options="gemeenten"
          />
        </VlPropertiesData>

        <!-- Postcode -->
        <VlPropertiesLabel>Postcode</VlPropertiesLabel>
        <VlPropertiesData>
          <VlMultiselect
            v-model="postcode"
            placeholder="Postcode"
            :mod-multiple="false"
            :options="postcodes"
          />
        </VlPropertiesData>

        <!-- Straat -->
        <VlPropertiesLabel>Straat</VlPropertiesLabel>
        <VlPropertiesData>
          <VlMultiselect
            v-model="straat"
            placeholder="Straat"
            :mod-multiple="false"
            :options="straten"
          />
        </VlPropertiesData>

        <!-- Huisnummer -->
        <VlPropertiesLabel>Huisnummer</VlPropertiesLabel>
        <VlPropertiesData>
          <VlMultiselect
            v-model="huisnummer"
            placeholder="Huisnummer"
            :mod-multiple="false"
            :options="huisnummers"
          />
        </VlPropertiesData>

        <!-- Busnummer -->
        <VlPropertiesLabel>Busnr.</VlPropertiesLabel>
        <VlPropertiesData>
          <VlMultiselect
            v-model="busnummer"
            placeholder="Busnummer"
            :mod-multiple="false"
            :options="busnummers"
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
import { VlMultiselect, VlProperties, VlPropertiesData, VlPropertiesLabel, VlPropertiesList, VlPropertiesTitle, VlSelect } from '@govflanders/vl-ui-design-system-vue3';
import { ref } from 'vue';

// Form values
const land = ref('');
const gemeente = ref('');
const postcode = ref('');
const straat = ref('');
const huisnummer = ref('');
const busnummer = ref('');

// Reference data
const landen = ref([
  { id: 'BE', naam: 'België' },
  { id: 'DE', naam: 'Duitsland' },
  { id: 'FR', naam: 'Frankrijk' },
  { id: 'GB', naam: 'Groot-Brittanië' },
  { id: 'NL', naam: 'Nederland' },
  { id: 'LU', naam: 'Luxemburg' },
  { id: 'divider', naam: '─────────────────────────', disabled: true }
]);
const gemeenten = ref(['Gent', 'Leuven'])
const postcodes = ref([])
const straten = ref([])
const huisnummers = ref([])
const busnummers = ref([])
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
}
</style>
