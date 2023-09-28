<template>
  <div>
    <editor
      ref="editorRef"
      v-model="test"
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
      @change="handlerFunction"
    />
  </div>
</template>

<script setup lang="ts">
import Editor from '@tinymce/tinymce-vue';
import { ref } from 'vue';

const editorRef = ref();
const test = ref('<p>test</p>');

const handlerFunction = (e: any) => {
  console.log(test.value);
};
</script>

<style lang="scss"></style>
