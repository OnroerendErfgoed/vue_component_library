<template>
  <div id="toolbar">
    <button class="ql-undo" title="Undo">
      <font-awesome-icon :icon="['fas', 'rotate-left']" />
    </button>
    <button class="ql-redo" title="Redo">
      <font-awesome-icon :icon="['fas', 'rotate-right']" />
    </button>
    <!-- Add headings dropdown -->
    <span class="ql-formats">
      <select class="ql-header">
        <option value="">Normal</option>
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
        <option value="3">Heading 3</option>
        <option value="4">Heading 4</option>
        <option value="5">Heading 5</option>
        <option value="6">Heading 6</option>
      </select>
    </span>
    <!-- Add a bold button -->
    <button class="ql-bold"></button>
    <!-- Add subscript and superscript buttons -->
    <button class="ql-private" title="Prive">
      <font-awesome-icon :icon="['fas', 'lock']" />
    </button>

    <button class="ql-list" value="ordered"></button>
    <button class="ql-list" value="bullet"></button>
  </div>

  <QuillyEditor ref="editor" v-model="model" style="height: 400px" :options="options" />
</template>

<script setup lang="ts">
import 'quill/dist/quill.snow.css';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Quill from 'quill';
import { htmlEditButton } from 'quill-html-edit-button';
import Block from 'quill/blots/block';
import { onMounted, ref } from 'vue';
import { QuillyEditor } from 'vue-quilly';

class PrivateBlock extends Block {
  static tagName = 'DIV';
  static className = 'prive';
  static blotName = 'private';
}

Quill.register(PrivateBlock, true);

const editor = ref<InstanceType<typeof QuillyEditor>>();
let quill: Quill | null = null;

Quill.register('modules/htmlEditButton', htmlEditButton);

const model = ref('<p>Hello Quilly!</p>');
const options = {
  theme: 'snow',
  modules: {
    toolbar: {
      container: '#toolbar',
      handlers: {
        private: (checked: boolean) => {
          quill?.format('private', checked);
        },
        undo: () => {
          return quill?.history.undo();
        },
        redo: () => {
          return quill?.history.redo();
        },
      },
    },

    // toolbar: {
    //   container: [
    //     [{ header: '1' }, { header: '2' }, { font: [] }],
    //     [{ size: [] }],
    //     ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    //     [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    //     ['link', 'image', 'video'],
    //     ['undo', 'redo'],
    //     ['clean'],
    //     ['lock'],
    //   ],
    //   handlers: {
    //     undo: () => {
    //       return quill!.history.undo();
    //     },
    //     redo: () => {
    //       return quill!.history.redo();
    //     },
    //   },
    // },
    history: {
      delay: 2000,
      maxStack: 500,
      userOnly: true,
    },
    htmlEditButton: {},
  },
  placeholder: 'Compose an epic...',
  readOnly: false,
};

onMounted(() => {
  quill = editor.value?.initialize(Quill) as Quill;
});
</script>

<style lang="scss" scoped>
.ql-container {
  font-size: 16px;

  :deep(strong) {
    font-weight: bolder;
  }

  :deep(em) {
    font-style: italic;
  }

  :deep(.prive) {
    color: grey;
  }

  :deep(p) {
    margin: 1rem 0;
  }
}
</style>
