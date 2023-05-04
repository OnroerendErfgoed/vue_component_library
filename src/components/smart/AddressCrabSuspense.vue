<template>
  <Suspense>
    <AddressCrab />
    <template #fallback> Loading... </template>
  </Suspense>
</template>

<script setup lang="ts">
import AddressCrab from '@components/smart/AddressCrab.vue';
</script>
