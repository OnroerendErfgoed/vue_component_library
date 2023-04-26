<template>
  <Suspense>
    <AddressCrab />
    <template #fallback>
      Loading...
    </template>
  </Suspense>
</template>

<script setup lang="ts">
  import AddressCrab from './AddressCrab.vue';
</script>