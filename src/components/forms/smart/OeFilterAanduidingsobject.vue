<template>
  <OeAutocomplete
    :id="props.id"
    data-cy="filter-aanduidingsobject"
    :callback-fn="performAutocompleteSearch"
    :value="aanduidingsobjectValue"
    placeholder="Geef naam of id in"
    @update:value="updateValue"
  />
</template>

<script setup lang="ts">
import OeAutocomplete from '../dumb/OeAutocomplete.vue';
import { IAutocompleteOption } from '../models/autocomplete';
import { IFilterAanduidingsobjectProps } from '../models/filter';
import { toRef } from '@vueuse/core';
import { ref, watch } from 'vue';
import { InventarisApiService } from '@services/inventaris-api.service';
import type { IESAanduidingsobject } from '@models/aanduidingsobject';

const props = withDefaults(defineProps<IFilterAanduidingsobjectProps>(), {
  id: '',
  api: '',
  value: '',
});
const inputValue = toRef(props, 'value');

const emit = defineEmits(['update:value']);

const inventarisApiService = new InventarisApiService(props.api);

const aanduidingsobjecten = ref<IESAanduidingsobject[]>([]);

const aanduidingsobjectValue = ref<IAutocompleteOption<IESAanduidingsobject>>();

watch(inputValue, () => {
  if (!inputValue?.value) {
    aanduidingsobjectValue.value = undefined;
  }
});

const updateValue = (value: IAutocompleteOption<IESAanduidingsobject>) => {
  aanduidingsobjectValue.value = value;
  emit('update:value', value);
};
const performAutocompleteSearch = async (searchTerm: string): Promise<IAutocompleteOption[]> => {
  try {
    aanduidingsobjecten.value = await inventarisApiService.getAanduidingsobjecten(`${searchTerm}*`);
    return aanduidingsobjecten.value.map((ao) => {
      return {
        title: ao.titel,
        value: ao.uri,
      };
    });
  } catch (error) {
    console.error('Error fetching autocomplete data:', error);
    return Promise.resolve([]);
  }
};
</script>
