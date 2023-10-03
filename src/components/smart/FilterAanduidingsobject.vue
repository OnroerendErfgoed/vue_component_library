<template>
  <oe-autocomplete
    :id="props.id"
    data-cy="filter-aanduidingsobject"
    :callback-fn="performAutocompleteSearch"
    :value="aanduidingsobjectValue"
    @update:value="updateValue"
  ></oe-autocomplete>
</template>

<script setup lang="ts">
import OeAutocomplete from '../dumb/OeAutocomplete.vue';
import { computed, ref } from 'vue';
import { InventarisApiService } from '@services/inventaris-api.service';
import type { IAutocompleteOption } from '@models/autocomplete';
import type { IESAanduidingsobject, IFilterAanduidingsobjectProps } from '@models/index';

const props = withDefaults(defineProps<IFilterAanduidingsobjectProps>(), {
  id: '',
  api: '',
  value: '',
});
const emit = defineEmits(['update:value']);

const inventarisApiService = new InventarisApiService(props.api);

const aanduidingsobjecten = ref<IESAanduidingsobject[]>([]);
const aanduidingsobjectValue = computed(() => {
  const aanduidingsobject = aanduidingsobjecten?.value.find((g) => g.uri === props.value);
  const autocompleteOption: IAutocompleteOption = {
    title: aanduidingsobject?.titel as string,
    value: aanduidingsobject,
  };
  return autocompleteOption;
});

const updateValue = (value: IESAanduidingsobject) => emit('update:value', value);
const performAutocompleteSearch = async (searchTerm: string): Promise<IAutocompleteOption[]> => {
  try {
    aanduidingsobjecten.value = await inventarisApiService.getAanduidingsobjecten(searchTerm);
    const autocompleteData: IAutocompleteOption[] = aanduidingsobjecten.value.map((ao) => {
      return {
        title: ao.titel,
        value: ao.uri,
      };
    });

    return autocompleteData;
  } catch (error) {
    console.error('Error fetching autocomplete data:', error);
    return Promise.resolve([]);
  }
};
</script>
