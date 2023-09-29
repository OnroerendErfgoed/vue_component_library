<template>
  <editor
    v-model="editorValue"
    api-key="no-api-key"
    :disabled="props.disabled"
    :init="{
      height: props.height,
      menubar: props.menubar,
      plugins: props.plugins,
      toolbar: props.toolbar,
    }"
    :model-events="modelEvents"
    @change="updateValue"
  />
</template>

<script setup lang="ts">
import Editor from '@tinymce/tinymce-vue';
import { ref, watch } from 'vue';

interface IOETinyMCEProps {
  modelValue: string;
  disabled?: boolean;
  height?: number;
  menubar?: boolean;
  plugins?: string | string[];
  toolbar?: string;
  modelEvents?: string;
}

const props = withDefaults(defineProps<IOETinyMCEProps>(), {
  modelValue: '',
  disabled: false,
  height: 500,
  menubar: false,
  plugins: () => [
    'advlist autolink lists link image charmap print preview anchor',
    'searchreplace visualblocks code fullscreen',
    'insertdatetime media table paste code help wordcount',
  ],
  toolbar:
    'undo redo | formatselect | bold italic backcolor | \
          alignleft aligncenter alignright alignjustify | \
          bullist numlist outdent indent | removeformat | help',
  modelEvents: 'change keydown blur focus paste',
});
const editorValue = ref(props.modelValue);
const emit = defineEmits(['update:modelValue']);

const updateValue = () => {
  emit('update:modelValue', editorValue.value);
};

watch(
  () => props.modelValue,
  () => {
    editorValue.value = props.modelValue;
  }
);
</script>

<style lang="scss"></style>
