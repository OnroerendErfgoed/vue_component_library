<template>
  <OeLoader v-if="isLoading" />
  <div v-else>
    <div v-if="_reference?.has_references" class="vl-u-spacer-bottom">
      <p class="vl-u-align-right vl-u-spacer-right--small">
        <span class="toggle vl-u-text--small vl-u-spacer-right--small" @click="toggleAccordions(true)">
          <FontAwesomeIcon :icon="faAngleDown" /> Alles tonen
        </span>
        <span class="toggle vl-u-text--small" @click="toggleAccordions(false)">
          <FontAwesomeIcon class="vl-u-spacer-right--xxsmall" :icon="faAngleUp" />Alles verbergen
        </span>
      </p>
      <span class="vl-u-mark--info vl-u-text">
        <span v-if="_reference.count === 1">Er werd <span class="vl-u-text--bold">1</span> referentie gevonden.</span>
        <span v-else
          >Er werden <span class="vl-u-text--bold">{{ _reference.count }}</span> referenties gevonden.</span
        >
      </span>
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
                <FontAwesomeIcon class="icon vl-u-spacer-right--xsmall" :icon="faAngleRight" />
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
import OeLoader from '../dumb/OeLoader.vue';
import { IReference } from '../models/reference';
import { faAngleDown, faAngleRight, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  VlAccordion,
  VlAccordionList,
  VlAccordionListItem,
  VlAlert,
  VlLink,
} from '@govflanders/vl-ui-design-system-vue3';
import { isEqual, sortBy } from 'lodash-es';
import { type ComponentPublicInstance, computed, onBeforeMount, ref, watch } from 'vue';
import { IdService } from '@services/id.service';

const props = defineProps<{ uri?: string; idServiceUrl?: string; reference?: IReference }>();
const isLoading = ref(false);

let idService: IdService;

const accordions = ref<ComponentPublicInstance[]>([]);
const _reference = ref<IReference>();

onBeforeMount(async () => {
  if (!props.reference && props.idServiceUrl && props.uri) {
    idService = new IdService(props.idServiceUrl);
    isLoading.value = true;
    _reference.value = await idService.getReferences(props.uri);
    isLoading.value = false;
  } else if (props.reference) {
    _reference.value = props.reference;
  } else {
    throw new Error('Geen reference of idServiceUrl en uri gevonden');
  }
});

watch(
  () => props.reference,
  (newValue, oldValue) => {
    if (!isEqual(newValue, oldValue)) {
      _reference.value = newValue;
    }
  },
  { deep: true }
);

const applications = computed(() => sortBy(_reference.value?.applications, 'title'));

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
