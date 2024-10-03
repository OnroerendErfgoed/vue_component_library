<template>
  <div>
    <div id="toolbar">
      <div class="toolbar-group">
        <button class="ql-undo" title="Undo">
          <font-awesome-icon :icon="['fas', 'rotate-left']" />
        </button>
        <button class="ql-redo" title="Redo">
          <font-awesome-icon :icon="['fas', 'rotate-right']" />
        </button>

        <span class="ql-stroke" />

        <!-- Add headings dropdown -->
        <select class="ql-header">
          <option value="">Paragraph</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
          <option value="4">Heading 4</option>
          <option value="5">Heading 5</option>
          <option value="6">Heading 6</option>
        </select>

        <span class="ql-stroke" />

        <!-- Add a bold button -->
        <button class="ql-bold"></button>
        <button class="ql-italic"></button>

        <span class="ql-stroke" />

        <button class="ql-list" value="ordered"></button>
        <button class="ql-list" value="bullet"></button>
        <button class="ql-indent" value="-1"></button>
        <button class="ql-indent" value="+1"></button>

        <span class="ql-stroke" />

        <button class="ql-clean"></button>

        <span class="ql-stroke" />

        <button class="ql-private" title="Prive">
          <font-awesome-icon :icon="['fas', 'lock']" />
        </button>
      </div>
    </div>

    <QuillyEditor
      ref="editor"
      v-model="model"
      style="height: 400px"
      :options="options"
      @blur="model = quill?.getSemanticHTML()"
    />

    <br />
    <h5>Output</h5>
    <br />
    <pre>{{ model }}</pre>
  </div>
</template>

<script setup lang="ts">
import 'quill/dist/quill.snow.css';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Quill from 'quill';
import { htmlEditButton } from 'quill-html-edit-button';
import QuillToggleFullscreenButton from 'quill-toggle-fullscreen-button';
import { onMounted, ref } from 'vue';
import { QuillyEditor } from 'vue-quilly';
import { PrivateBlock } from '@models/editor';

// Register custom blocks and modules
Quill.register(PrivateBlock, true);
Quill.register('modules/htmlEditButton', htmlEditButton);
Quill.register('modules/toggleFullscreen', QuillToggleFullscreenButton);

// Quill config
let quill: Quill;

const editor = ref<InstanceType<typeof QuillyEditor>>();
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
    history: {
      delay: 2000,
      maxStack: 500,
      userOnly: true,
    },
    htmlEditButton: {
      buttonTitle: 'Source code',
      msg: 'Source code',
      okText: 'Opslaan',
      cancelText: 'Annuleren',
    },
    toggleFullscreen: {
      buttonTitle: 'Fullscreen',
    },
  },
  placeholder: 'Compose an epic...',
  readOnly: false,
};

// Model
const model = ref('<p>Hello Quilly!</p>');

onMounted(() => {
  quill = editor.value?.initialize(Quill) as Quill;
});
</script>

<style lang="scss" scoped>
.ql-toolbar {
  display: flex;
  justify-content: space-between;

  :deep(.ql-formats) {
    margin-right: 0;
  }

  .toolbar-group {
    display: flex;
    width: 100%;

    .ql-stroke {
      margin: -8px 8px;
      width: 1px; /* Line thickness */
      display: inline-block;
      background-color: #ccc; /* Line color */
    }
  }
}

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

:global(.ql-html-textArea.ql-container) {
  position: relative !important;
  left: 0 !important;
  height: calc(100% - 30px) !important;
  width: 100%;
}

:global(.ql-html-buttonGroup) {
  position: relative !important;
  left: unset !important;
  bottom: 0 !important;
  transform: scale(1) !important;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 15px;
}

:global(.ql-html-buttonOk),
:global(.ql-html-buttonCancel) {
  border-radius: 0;
  -moz-appearance: none;
  appearance: none;
  -webkit-appearance: none;
  border: 0;
  background-color: transparent;
  padding: 0;
  display: inline-flex;
  align-items: center;
  min-height: 3.5rem;
  font-size: 1.6rem;
  font-family: Flanders Art Sans, sans-serif;
  font-weight: 500;
  padding: 0.5rem 2rem;
  background-color: var(--vl-theme-action-color, #944ea1);
  text-decoration: none;
  border-radius: 0.3rem;
  color: #fff;
  text-align: center;
  outline: 0;
  max-width: 100%;
  cursor: pointer;
}

:global(.ql-html-buttonCancel) {
  background-color: transparent;
  color: var(--vl-theme-action-color, #944ea1);
  border: 0.2rem solid currentColor;
  transition: color 0.2s, border-color 0.2s, box-shadow 0.2s;
}
</style>
