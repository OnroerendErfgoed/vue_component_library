<template>
  <template v-if="loading">
    <OeLoader mod-inline>Waarnemingen aan het laden...</OeLoader>
    <OeLoader mod-inline>Gebeurtenissen aan het laden...</OeLoader>
  </template>
  <OeInventarisLoadedLink v-else :waarnemingen="waarnemingen" :gebeurtenissen="gebeurtenissen" />
</template>

<script setup lang="ts">
import OeInventarisLoadedLink from '../dumb/OeInventarisLoadedLink.vue';
import OeLoader from '../dumb/OeLoader.vue';
import { IInventarisLinkGebeurtenis, IInventarisLinkWaarneming, ILinks } from '../models/links';
import { onBeforeMount, ref } from 'vue';
import { axiosInstance } from '@services/http.service';

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
      Authorization: `Bearer ${await props.getSsoToken()}`,
    },
  };
  if (props.links) {
    loading.value = true;
    waarnemingen.value = (await axiosInstance.get(props.links.relaties.waarnemingen.href, options)).data;
    gebeurtenissen.value = (await axiosInstance.get(props.links.relaties.gebeurtenissen.href, options)).data;
    loading.value = false;
  }
});
</script>
