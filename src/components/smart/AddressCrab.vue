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
            :custom-label="customGemeenteLabel"
            :disabled="!land"
            :mod-multiple="false"
            :options="gemeenten"
          >
            <template #option="props">
              <div>
                <span>{{ props.option.naam }}</span>
              </div>
            </template>
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
            :custom-label="customPostcodeLabel"
            :disabled="!gemeente"
            :mod-multiple="false"
            :options="postcodes"
          >
            <template #option="props">
              <div>
                <span>{{ props.option.id }}</span>
              </div>
            </template>
          </VlMultiselect>

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
            :custom-label="customStraatLabel"
            :disabled="!gemeente"
            :mod-multiple="false"
            :options="straten"
          >
            <template #option="props">
              <div>
                <span>{{ props.option.naam }}</span>
              </div>
            </template>
          </VlMultiselect>

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
            :custom-label="customHuisnummerLabel"
            :disabled="!straat"
            :mod-multiple="false"
            :options="huisnummers"
          >
            <template #option="props">
              <div>
                <span>{{ props.option.naam }}</span>
              </div>
            </template>
          </VlMultiselect>

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

    Form values:
    <pre>{{ adres }}</pre>
  </div>
</template>

<script setup lang="ts">
import { VlInputField, VlMultiselect, VlProperties, VlPropertiesData, VlPropertiesLabel, VlPropertiesList, VlPropertiesTitle, VlSelect } from '@govflanders/vl-ui-design-system-vue3';
import { computed, ref, watch } from 'vue';
import { CrabService } from '../../services/crab.api-service';
import type { Adres, Gemeente, Huisnummer, Land, Postcode, Straat } from '../../services/models/locatie';

// Custom multiselect labels
const customGemeenteLabel = (option: Gemeente) => option.naam;
const customPostcodeLabel = (option: Postcode) => option.id;
const customStraatLabel = (option: Straat) => option.naam;
const customHuisnummerLabel = (option: Huisnummer) => option.naam;

// Form values
const land = ref('');
const gemeente = ref('');
const postcode = ref('');
const straat = ref('');
const huisnummer = ref('');
const busnummer = ref('');

const isBelgiumOrEmpty = computed(() => land.value === 'BE' || land.value === '');
const adres = computed<Adres>(() => ({
  land: land.value,
  gemeente: typeof gemeente.value === 'string' ? gemeente.value : (gemeente.value as Gemeente).niscode.toString(),
  postcode: typeof postcode.value === 'string' ? postcode.value : (postcode.value as Postcode).id.toString(),
  straat: typeof straat.value === 'string' ? straat.value : (straat.value as Straat).id.toString(),
  huisnummer: typeof huisnummer.value === 'string' ? huisnummer.value : (huisnummer.value as Huisnummer).id.toString(),
  subadres: busnummer.value,
}));

// Reference data
const crabService = new CrabService();

const staticLanden: Land[] = [
  { id: 'BE', naam: 'België' },
  { id: 'DE', naam: 'Duitsland' },
  { id: 'FR', naam: 'Frankrijk' },
  { id: 'GB', naam: 'Groot-Brittanië' },
  { id: 'NL', naam: 'Nederland' },
  { id: 'LU', naam: 'Luxemburg' },
  { id: 'divider', naam: '─────────────────────────', disabled: true },
];
const apiLanden: Land[] = await crabService.getLanden();
const landen = computed<Land[]>(() => [...staticLanden, ...apiLanden]);
const gemeenten: Gemeente[] = await crabService.getGemeenten();
const postcodes = ref<Postcode[]>([]);
const straten = ref<Straat[]>([]);
const huisnummers = ref<Huisnummer[]>([]);

// Gemeente side-effects
watch(gemeente, async (selectedGemeente: Gemeente | string) => {
  postcode.value = '';
  straat.value = '';

  if (isBelgiumOrEmpty.value && selectedGemeente) {
    postcodes.value = await crabService.getPostcodes((selectedGemeente as Gemeente).id);
    straten.value = await crabService.getStraten((selectedGemeente as Gemeente).id);
  }
});

// Straat side-effects
watch(straat, async (selectedStraat: Straat | string) => {
  huisnummer.value = '';

  if (isBelgiumOrEmpty.value && selectedStraat) {
    huisnummers.value = await crabService.getHuisnummers((selectedStraat as Straat).id);
  }
});
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
