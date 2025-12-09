<template>
  <div :id="props.id" :class="{ 'editor-disabled': props.modDisabled }">
    <div :id="`${props.id}-toolbar`">
      <div class="toolbar-container">
        <div v-if="includes(tb, OeEditorToolbar.UNDO) || includes(tb, OeEditorToolbar.REDO)" class="toolbar-group">
          <button v-if="includes(tb, OeEditorToolbar.UNDO)" class="ql-undo" title="Undo">
            <FontAwesomeIcon :icon="faRotateLeft" />
          </button>
          <button v-if="includes(tb, OeEditorToolbar.REDO)" class="ql-redo" title="Redo">
            <FontAwesomeIcon :icon="faRotateRight" />
          </button>
        </div>

        <div v-if="includes(tb, OeEditorToolbar.HEADER)" class="toolbar-group">
          <select class="ql-header">
            <option value="">Paragraph</option>
            <option value="1">Heading 1</option>
            <option value="2">Heading 2</option>
            <option value="3">Heading 3</option>
            <option value="4">Heading 4</option>
            <option value="5">Heading 5</option>
            <option value="6">Heading 6</option>
          </select>
        </div>

        <div
          v-if="includes(tb, OeEditorToolbar.BLOCKQUOTE) || includes(tb, OeEditorToolbar.CODEBLOCK)"
          class="toolbar-group"
        >
          <button v-if="includes(tb, OeEditorToolbar.BLOCKQUOTE)" class="ql-blockquote"></button>
          <button v-if="includes(tb, OeEditorToolbar.CODEBLOCK)" class="ql-code-block"></button>
        </div>

        <div
          v-if="
            includes(tb, OeEditorToolbar.BOLD) ||
            includes(tb, OeEditorToolbar.ITALIC) ||
            includes(tb, OeEditorToolbar.UNDERLINE) ||
            includes(tb, OeEditorToolbar.STRIKE)
          "
          class="toolbar-group"
        >
          <button v-if="includes(tb, OeEditorToolbar.BOLD)" class="ql-bold"></button>
          <button v-if="includes(tb, OeEditorToolbar.ITALIC)" class="ql-italic"></button>
          <button v-if="includes(tb, OeEditorToolbar.UNDERLINE)" class="ql-underline"></button>
          <button v-if="includes(tb, OeEditorToolbar.STRIKE)" class="ql-strike"></button>
        </div>
        <div
          v-if="includes(tb, OeEditorToolbar.COLOR) || includes(tb, OeEditorToolbar.BACKGROUND)"
          class="toolbar-group"
        >
          <select v-if="includes(tb, OeEditorToolbar.COLOR)" class="ql-color"></select>
          <select v-if="includes(tb, OeEditorToolbar.BACKGROUND)" class="ql-background"></select>
        </div>

        <div v-if="includes(tb, OeEditorToolbar.SUB) || includes(tb, OeEditorToolbar.SUPER)" class="toolbar-group">
          <button v-if="includes(tb, OeEditorToolbar.SUB)" class="ql-script" value="sub"></button>
          <button v-if="includes(tb, OeEditorToolbar.SUPER)" class="ql-script" value="super"></button>
        </div>

        <div
          v-if="
            includes(tb, OeEditorToolbar.NUMLIST) ||
            includes(tb, OeEditorToolbar.BULLIST) ||
            includes(tb, OeEditorToolbar.INDENT) ||
            includes(tb, OeEditorToolbar.OUTDENT) ||
            includes(tb, OeEditorToolbar.ALIGN)
          "
          class="toolbar-group"
        >
          <button v-if="includes(tb, OeEditorToolbar.NUMLIST)" class="ql-list" value="ordered"></button>
          <button v-if="includes(tb, OeEditorToolbar.BULLIST)" class="ql-list" value="bullet"></button>
          <button v-if="includes(tb, OeEditorToolbar.OUTDENT)" class="ql-indent" value="-1"></button>
          <button v-if="includes(tb, OeEditorToolbar.INDENT)" class="ql-indent" value="+1"></button>
          <select v-if="includes(tb, OeEditorToolbar.ALIGN)" class="ql-align"></select>
        </div>

        <div
          v-if="
            includes(tb, OeEditorToolbar.LINK) ||
            includes(tb, OeEditorToolbar.IMAGE) ||
            includes(tb, OeEditorToolbar.VIDEO) ||
            includes(tb, OeEditorToolbar.FORMULA)
          "
          class="toolbar-group"
        >
          <button v-if="includes(tb, OeEditorToolbar.LINK)" class="ql-link"></button>
          <button v-if="includes(tb, OeEditorToolbar.IMAGE)" class="ql-image"></button>
          <button v-if="includes(tb, OeEditorToolbar.VIDEO)" class="ql-video"></button>
          <button v-if="includes(tb, OeEditorToolbar.FORMULA)" class="ql-formula"></button>
        </div>

        <div v-if="includes(tb, OeEditorToolbar.REMOVEFORMAT)" class="toolbar-group">
          <button v-if="includes(tb, OeEditorToolbar.REMOVEFORMAT)" class="ql-clean"></button>
        </div>

        <div v-if="includes(tb, OeEditorToolbar.BIBLIO) || includes(tb, OeEditorToolbar.PRIVATE)" class="toolbar-group">
          <button v-if="includes(tb, OeEditorToolbar.BIBLIO)" class="ql-biblio" title="Bibliografie">
            <FontAwesomeIcon :icon="faBookmark" />
          </button>

          <button v-if="includes(tb, OeEditorToolbar.PRIVATE)" class="ql-private" title="Prive">
            <FontAwesomeIcon :icon="faLock" />
          </button>
        </div>
      </div>
    </div>

    <QuillyEditor ref="editor" v-model="model" :style="{ height: `${props.height}px` }" :options="options" />
  </div>
</template>

<script setup lang="ts">
import 'quill/dist/quill.snow.css';
import { BibliografieBlock, OeEditorFormat, OeEditorProps, OeEditorToolbar, PrivateBlock } from '../models/editor';
import { faBookmark, faLock, faRotateLeft, faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { includes } from 'lodash-es';
import Quill from 'quill';
import { htmlEditButton } from 'quill-html-edit-button';
import QuillToggleFullscreenButton from 'quill-toggle-fullscreen-button';
import { computed, onMounted, ref, watch } from 'vue';
import { QuillyEditor } from 'vue-quilly';

const props = withDefaults(defineProps<OeEditorProps>(), {
  height: 400,
  modDisabled: false,
  toolbar: () => [
    OeEditorToolbar.UNDO,
    OeEditorToolbar.REDO,
    OeEditorToolbar.HEADER,
    OeEditorToolbar.BOLD,
    OeEditorToolbar.ITALIC,
    OeEditorToolbar.BULLIST,
    OeEditorToolbar.NUMLIST,
    OeEditorToolbar.INDENT,
    OeEditorToolbar.OUTDENT,
    OeEditorToolbar.REMOVEFORMAT,
  ],
  formats: () => [
    OeEditorFormat.ITALIC,
    OeEditorFormat.BOLD,
    OeEditorFormat.HEADER,
    OeEditorFormat.LIST,
    OeEditorFormat.INDENT,
  ],
  enableFullToolbar: false,
  enableAllFormats: false,
});

const tb = computed(() => (props.enableFullToolbar ? Object.values(OeEditorToolbar) : props.toolbar));

// Register custom blocks and modules
Quill.register(PrivateBlock, true);
Quill.register(BibliografieBlock, true);

if (includes(tb.value, OeEditorToolbar.CODE)) {
  Quill.register('modules/htmlEditButton', htmlEditButton);
}

if (includes(tb.value, OeEditorToolbar.FULLSCREEN)) {
  Quill.register('modules/toggleFullscreen', QuillToggleFullscreenButton);
}

// Quill config
let quill: Quill;

const editor = ref<InstanceType<typeof QuillyEditor>>();
const options = computed(() => ({
  theme: 'snow',
  ...(!props.enableAllFormats && !props.enableFullToolbar && { formats: props.formats }),
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
    ...(includes(tb.value, OeEditorToolbar.CODE) && {
      htmlEditButton: {
        prependSelector: `#${props.id}`,
        buttonTitle: 'Source code',
        msg: 'Source code',
        okText: 'Opslaan',
        cancelText: 'Annuleren',
      },
    }),
    ...(includes(tb.value, OeEditorToolbar.FULLSCREEN) && {
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
@import '@OnroerendErfgoed/pyoes/scss/base-variables';

.editor-disabled {
  * {
    background-color: $light-gray;
  }

  .ql-toolbar {
    cursor: not-allowed;

    * {
      cursor: not-allowed;
      pointer-events: none;
    }
  }
}

.ql-toolbar {
  display: flex;
  justify-content: space-between;
  padding: 8px 2px;

  :deep(.ql-formats) {
    margin-right: 0;
  }

  .toolbar-container {
    display: flex;
    width: 100%;

    .toolbar-group {
      position: relative;
      padding: 0 2px;

      &::after {
        content: '';
        background-color: #ccc;
        position: absolute;
        bottom: -8px;
        right: 0;
        height: calc(100% + 16px);
        width: 1.5px;
      }
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
  font-family:
    Flanders Art Sans,
    sans-serif;
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
  transition:
    color 0.2s,
    border-color 0.2s,
    box-shadow 0.2s;
}
</style>
