<template>
  <div class="spinner-container">
    <div class="spinner-overlay">
      <div class="spinner-content">
        <font-awesome-icon class="spinner" :icon="['fas', 'spinner']" spin-pulse />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
</script>

<style lang="scss" scoped>
.spinner-container div {
  z-index: 1001;
}
.spinner-container .spinner-overlay {
  background-color: rgba(152, 152, 152, 0.5);
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.spinner-container .spinner-content {
  display: table;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  padding: 3px;
  width: 100px;
  height: 100px;
  margin: auto;
  background: rgb(117, 63, 127);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: fixed;
  -webkit-border-radius: 50px;
  -moz-border-radius: 50px;
  border-radius: 50px;
}
.spinner-container .spinner {
  position: absolute;
  top: 25%;
  left: 25%;
  font-size: 50px;
  color: rgb(255, 255, 255);
}
</style>
