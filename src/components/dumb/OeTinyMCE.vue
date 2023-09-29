<template>
  <div>
    <editor
      v-model="editorValue"
      api-key="no-api-key"
      :init="{
        height: 500,
        menubar: false,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount',
        ],
        toolbar:
          'undo redo | formatselect | bold italic backcolor | \
            alignleft aligncenter alignright alignjustify | \
            bullist numlist outdent indent | removeformat | help',
      }"
      model-events="change keydown blur focus paste"
      @change="updateValue"
    />
  </div>
</template>

<script setup lang="ts">
import Editor from '@tinymce/tinymce-vue';
import { ref } from 'vue';

interface IOETinyMCEProps {
  value: string;
}

const props = withDefaults(defineProps<IOETinyMCEProps>(), {
  value: '',
});
const editorValue = ref(props.value);
const emit = defineEmits(['update:value']);

const updateValue = () => {
  emit('update:value', editorValue.value);
};
</script>

<style lang="scss"></style>
