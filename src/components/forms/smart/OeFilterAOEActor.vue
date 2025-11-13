<template>
  <OeAutocomplete
    :id="props.id"
    data-cy="filter-actor"
    :callback-fn="performAutocompleteSearch"
    :value="actorValue"
    @update:value="updateValue"
  />
</template>

<script setup lang="ts">
import OeAutocomplete from '../dumb/OeAutocomplete.vue';
import { IAutocompleteOption } from '../models/autocomplete';
import { IFilterActorProps } from '../models/filter';
import { computed, ref } from 'vue';
import { ActorService } from '@services/actor.service';
import type { IActor } from '@models/actor';

const props = withDefaults(defineProps<IFilterActorProps>(), {
  id: '',
  api: '',
  value: '',
  getSsoToken: undefined,
  groepActoren: () => [],
});
const emit = defineEmits(['update:value']);

const actorService = new ActorService(props.api, props.getSsoToken);

const actoren = ref<IActor[]>([]);
const actorValue = computed(() => {
  if (props.groepActoren.length > 0) {
    const group = props.groepActoren?.find((g) => g.id === props.value || g.omschrijving === props.value);
    if (group) {
      const autocompleteOption: IAutocompleteOption = {
        title: group.omschrijving,
        value: group,
      };
      return autocompleteOption;
    }
  }

  const actor = actoren?.value.find((g) => g.uri === props.value || g.omschrijving === props.value);
  const autocompleteOption: IAutocompleteOption = {
    title: actor?.omschrijving as string,
    value: actor,
  };
  return autocompleteOption;
});

const updateValue = (value: IActor) => emit('update:value', value);
const filterGroepActoren = (searchTerm: string): IAutocompleteOption[] => {
  return props.groepActoren
    .filter((group) => group.omschrijving.toLowerCase().includes(searchTerm.toLowerCase()))
    .map((group) => ({
      title: group.omschrijving,
      value: group,
    }));
};
const performAutocompleteSearch = async (searchTerm: string): Promise<IAutocompleteOption[]> => {
  try {
    let filteredGroups: IAutocompleteOption[] = [];

    if (props.groepActoren.length > 0) {
      filteredGroups = filterGroepActoren(searchTerm);
    }

    actoren.value = await actorService.getAOEActoren(searchTerm);
    const actorOptions = actoren.value.map((actor) => ({
      title: actor.omschrijving,
      value: actor.uri,
    }));

    return [...filteredGroups, ...actorOptions];
  } catch (error) {
    console.error('Error fetching autocomplete data:', error);
    if (props.groepActoren.length > 0) {
      return filterGroepActoren(searchTerm);
    }
    return [];
  }
};
</script>
