<template>
  <div :id="props.id">
    <div :id="`${props.id}-toolbar`" :class="{ 'ql-toolbar--disabled': props.modDisabled }">
      <div class="toolbar-group">
        <button v-if="props.toolbar.undo" class="ql-undo" title="Undo">
          <font-awesome-icon :icon="['fas', 'rotate-left']" />
        </button>
        <button v-if="props.toolbar.redo" class="ql-redo" title="Redo">
          <font-awesome-icon :icon="['fas', 'rotate-right']" />
        </button>

        <span v-if="props.toolbar.undo || props.toolbar.redo" class="ql-stroke" />

        <!-- Add headings dropdown -->
        <select v-if="props.toolbar.header" class="ql-header">
          <option value="">Paragraph</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
          <option value="4">Heading 4</option>
          <option value="5">Heading 5</option>
          <option value="6">Heading 6</option>
        </select>

        <span v-if="props.toolbar.header" class="ql-stroke" />

        <!-- Add a bold button -->
        <button v-if="props.toolbar.bold" class="ql-bold"></button>
        <button v-if="props.toolbar.italic" class="ql-italic"></button>

        <span v-if="props.toolbar.bold || props.toolbar.italic" class="ql-stroke" />

        <button v-if="props.toolbar.numlist" class="ql-list" value="ordered"></button>
        <button v-if="props.toolbar.bullist" class="ql-list" value="bullet"></button>
        <button v-if="props.toolbar.outdent" class="ql-indent" value="-1"></button>
        <button v-if="props.toolbar.indent" class="ql-indent" value="+1"></button>

        <span
          v-if="props.toolbar.numlist || props.toolbar.bullist || props.toolbar.outdent || props.toolbar.indent"
          class="ql-stroke"
        />

        <button v-if="props.toolbar.removeformat" class="ql-clean"></button>

        <span v-if="props.toolbar.removeformat" class="ql-stroke" />

        <button v-if="props.toolbar.biblio" class="ql-biblio" title="Bibliografie">
          <font-awesome-icon :icon="['fas', 'bookmark']" />
        </button>

        <button v-if="props.toolbar.private" class="ql-private" title="Prive">
          <font-awesome-icon :icon="['fas', 'lock']" />
        </button>
      </div>
    </div>

    <QuillyEditor
      ref="editor"
      v-model="model"
      :style="{ height: `${props.height}px` }"
      :options="options"
      @blur="model = quill?.getSemanticHTML()"
    />
  </div>
</template>

<script setup lang="ts">
import 'quill/dist/quill.snow.css';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Quill from 'quill';
import { htmlEditButton } from 'quill-html-edit-button';
import QuillToggleFullscreenButton from 'quill-toggle-fullscreen-button';
import { computed, onMounted, ref, watch } from 'vue';
import { QuillyEditor } from 'vue-quilly';
import { BibliografieBlock, type OeEditorProps, PrivateBlock } from '@models/editor';

const props = withDefaults(defineProps<OeEditorProps>(), {
  height: 400,
  modDisabled: false,
  toolbar: () => ({
    undo: true,
    redo: true,
    header: true,
    bold: true,
    italic: true,
    bullist: true,
    numlist: true,
    indent: true,
    outdent: true,
    removeformat: true,
    biblio: false,
    private: false,
    code: false,
    fullscreen: false,
  }),
});

// Register custom blocks and modules
Quill.register(PrivateBlock, true);
Quill.register(BibliografieBlock, true);

if (props.toolbar.code) {
  Quill.register('modules/htmlEditButton', htmlEditButton);
}

if (props.toolbar.fullscreen) {
  Quill.register('modules/toggleFullscreen', QuillToggleFullscreenButton);
}

// Quill config
let quill: Quill;

const editor = ref<InstanceType<typeof QuillyEditor>>();
const options = computed(() => ({
  theme: 'snow',
  modules: {
    toolbar: {
      container: `#${props.id}-toolbar`,
      handlers: {
        private: (checked: boolean) => {
          if (quill.isEnabled()) {
            quill?.format('private', checked);
          }
        },
        biblio: (checked: boolean) => {
          if (quill.isEnabled()) {
            quill?.format('biblio', checked);
          }
        },
        undo: () => {
          if (quill.isEnabled()) {
            return quill?.history.undo();
          }
        },
        redo: () => {
          if (quill.isEnabled()) {
            return quill?.history.redo();
          }
        },
      },
    },
    history: {
      delay: 2000,
      maxStack: 500,
      userOnly: true,
    },
    ...(props.toolbar.code && {
      htmlEditButton: {
        prependSelector: `#${props.id}`,
        buttonTitle: 'Source code',
        msg: 'Source code',
        okText: 'Opslaan',
        cancelText: 'Annuleren',
      },
    }),
    ...(props.toolbar.fullscreen && {
      toggleFullscreen: {
        buttonTitle: 'Fullscreen',
      },
    }),
  },
  placeholder: '',
  readOnly: props.modDisabled,
}));

// Model
const model = defineModel({ type: String });

onMounted(() => {
  quill = editor.value?.initialize(Quill) as Quill;
});

watch(
  () => props.modDisabled,
  () => {
    if (props.modDisabled) {
      quill.disable();
    } else {
      quill.enable();
    }
  }
);
</script>

<style lang="scss" scoped>
.ql-toolbar {
  display: flex;
  justify-content: space-between;

  :deep(.ql-formats) {
    margin-right: 0;
  }

  &--disabled {
    cursor: not-allowed;

    * {
      cursor: not-allowed;
      pointer-events: none;
    }
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
