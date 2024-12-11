<template>
  <oe-autocomplete
    :id="props.id"
    data-cy="filter-actor"
    :callback-fn="performAutocompleteSearch"
    :value="actorValue"
    @update:value="updateValue"
  ></oe-autocomplete>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import OeAutocomplete from '@components/dumb/OeAutocomplete.vue';
import { ActorService } from '@services/actor.service';
import type { IActor } from '@models/actor';
import type { IAutocompleteOption } from '@models/autocomplete';
import type { IFilterActorProps } from '@models/index';

const props = withDefaults(defineProps<IFilterActorProps>(), {
  id: '',
  api: '',
  value: '',
  getSsoToken: undefined,
});
const emit = defineEmits(['update:value']);

const actorService = new ActorService(props.api, props.getSsoToken);

const actoren = ref<IActor[]>([]);
const actorValue = computed(() => {
  const actor = actoren?.value.find((g) => g.uri === props.value || g.omschrijving === props.value);
  const autocompleteOption: IAutocompleteOption = {
    title: actor?.omschrijving as string,
    value: actor,
  };
  return autocompleteOption;
});

const updateValue = (value: IActor) => emit('update:value', value);
const performAutocompleteSearch = async (searchTerm: string): Promise<IAutocompleteOption[]> => {
  try {
    actoren.value = await actorService.getAOEActoren(searchTerm);
    return actoren.value.map((actor) => {
      return {
        title: actor.omschrijving,
        value: actor.uri,
      };
    });
  } catch (error) {
    console.error('Error fetching autocomplete data:', error);
    return Promise.resolve([]);
  }
};
</script>
