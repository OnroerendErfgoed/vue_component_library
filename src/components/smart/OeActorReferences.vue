<template>
  <oe-loader v-if="isLoading" />
  <div v-else>
    <div v-if="references?.has_references" class="vl-u-spacer-bottom">
      <p class="vl-u-align-right vl-u-spacer-right--small">
        <span class="toggle vl-u-text--small vl-u-spacer-right--small" @click="toggleAccordions(true)">
          <font-awesome-icon :icon="['fas', 'angle-down']" /> Alles tonen
        </span>
        <span class="toggle vl-u-text--small" @click="toggleAccordions(false)">
          <font-awesome-icon class="vl-u-spacer-right--xxsmall" :icon="['fas', 'angle-up']" />Alles verbergen
        </span>
      </p>
      <span class="vl-u-mark--info vl-u-text">
        Er werden <span class="vl-u-text--bold">{{ references.count }}</span> referenties gevonden.</span
      >
      <p class="vl-u-text--small">(Er worden max. 5 referenties per applicatie getoond)</p>

      <!-- Default slot  -->
      <slot></slot>

      <vl-accordion-list mod-bordered>
        <vl-accordion-list-item v-for="(application, index) in applications" :key="index" ref="accordions">
          <vl-accordion mod-xsmall mod-icon-right>
            <template #title>
              <span class="vl-accordion__title"
                >{{ application.title }}
                <span class="vl-u-text--small"
                  >({{ application.count }} {{ application.count === 1 ? 'referentie' : 'referenties' }})</span
                ></span
              >
            </template>
            <template v-if="application.count">
              <div v-for="item in application.items.slice(0, 5)" :key="item.uri">
                <font-awesome-icon class="icon vl-u-spacer-right--xsmall" :icon="['fas', 'angle-right']" />
                <vl-link :href="item.uri" target="_blank">{{ item.title }}</vl-link>
              </div>
            </template>
            <span v-else class="vl-u-mark--info vl-u-text">
              Er werden <span class="vl-u-text--bold">geen</span> referenties gevonden.</span
            >
          </vl-accordion>
        </vl-accordion-list-item>
      </vl-accordion-list>
    </div>
    <vl-alert v-else class="vl-u-spacer-bottom" mod-warning icon="warning"
      >Er werden geen referenties gevonden.</vl-alert
    >
  </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  VlAccordion,
  VlAccordionList,
  VlAccordionListItem,
  VlAlert,
  VlLink,
} from '@govflanders/vl-ui-design-system-vue3';
import { sortBy } from 'lodash';
import { type ComponentPublicInstance, computed, onBeforeMount, ref } from 'vue';
import OeLoader from '@components/dumb/OeLoader.vue';
import { IdService } from '@services/id.service';
import type { IReference } from '@models/reference';

const props = defineProps<{ actorUri?: string; idServiceUrl?: string; koppeling?: IReference }>();
const isLoading = ref(false);

let idService: IdService;

const accordions = ref<ComponentPublicInstance[]>([]);
const references = ref<IReference>();

onBeforeMount(async () => {
  if (!props.koppeling && props.idServiceUrl && props.actorUri) {
    idService = new IdService(props.idServiceUrl);
    isLoading.value = true;
    references.value = await idService.getReferences(props.actorUri);
    isLoading.value = false;
  } else if (props.koppeling) {
    references.value = props.koppeling;
  } else {
    throw new Error('Geen koppeling of idServiceUrl en actorUri gevonden');
  }
});

const applications = computed(() => sortBy(references.value?.applications, 'title'));

const accordionsOpen = ref(false);
const toggleAccordions = (open: boolean) => {
  if (accordionsOpen.value === open) {
    return;
  } else {
    accordionsOpen.value = open;
    accordions.value.forEach((r) => {
      const accordionContentVisible =
        (r.$el.querySelector('.vl-accordion__content') as HTMLElement).getAttribute('aria-hidden') === 'false';

      if ((open && !accordionContentVisible) || (!open && accordionContentVisible)) {
        (r.$el.querySelector('.vl-toggle') as HTMLElement).click();
      }
    });
  }
};
</script>

<style lang="scss" scoped>
@import 'pyoes/scss/base-variables';

:deep(.vl-link, .vl-sidebar-header__toggle, .vl-sidebar-panel-list-item__button .vl-icon) {
  color: $primary-color !important;
}

.vl-accordion-list {
  padding: 1rem;
  overflow: auto;
  max-height: 60vh;

  :deep(div.vl-accordion__summary > button) {
    cursor: pointer !important;
  }
}

.vl-u-text--small {
  color: $silver;
}

.toggle {
  cursor: pointer;
}
</style>
