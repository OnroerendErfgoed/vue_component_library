<template>
  <Suspense>
    <AdresCrab />
    <template #fallback> Loading... </template>
  </Suspense>
</template>

<script setup lang="ts">
import AdresCrab from '@components/smart/AdresCrab.vue';
</script>
