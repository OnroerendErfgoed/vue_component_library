<template>
  <template v-if="loading">
    <div>Waarnemingen aan het laden... <font-awesome-icon class="spinner" :icon="['fas', 'spinner']" spin-pulse /></div>
    <div>
      Gebeurtenissen aan het laden... <font-awesome-icon class="spinner" :icon="['fas', 'spinner']" spin-pulse />
    </div>
  </template>
  <template v-else>
    <OeInventarisLoadedLink :waarnemingen="waarnemingen" :gebeurtenissen="gebeurtenissen"></OeInventarisLoadedLink>
  </template>
</template>
<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import axios from 'axios';
import { onBeforeMount, ref } from 'vue';
import OeInventarisLoadedLink from '@components/core/dumb/OeInventarisLoadedLink.vue';
import type { IInventarisLinkGebeurtenis, IInventarisLinkWaarneming, ILinks } from '@components/core/models/links';

interface IOeInventarisLink {
  links: ILinks;
  getSsoToken: () => Promise<string>;
}

const props = withDefaults(defineProps<IOeInventarisLink>(), {
  links: undefined,
  getSsoToken: undefined,
});

const waarnemingen = ref<IInventarisLinkWaarneming[] | []>([]);
const gebeurtenissen = ref<IInventarisLinkGebeurtenis[] | []>([]);
const loading = ref(false);

onBeforeMount(async () => {
  const options = {
    headers: {
      Accept: 'Application/json',
      Authorization: `Bearer ${await props.getSsoToken()}`,
    },
  };
  if (props.links) {
    waarnemingen.value = (await axios.get(props.links.relaties.waarnemingen.href, options)).data;
    gebeurtenissen.value = (await axios.get(props.links.relaties.gebeurtenissen.href, options)).data;
    loading.value = false;
  }
});
</script>
