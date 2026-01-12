<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="markdown-body" v-html="html" />
</template>

<script setup lang="ts">
import { marked } from 'marked';
import { computed } from 'vue';

const props = defineProps<{
  content: string;
}>();

// Configure marked for better rendering
marked.setOptions({
  breaks: true,
  gfm: true,
});

const html = computed(() => marked(props.content));
</script>

<style scoped>
.markdown-body {
  padding: 3rem;
  max-width: 1200px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: #24292f;
  background-color: #ffffff;
}

/* Headings */
.markdown-body :deep(h1) {
  font-size: 2em;
  font-weight: 600;
  border-bottom: 1px solid #d0d7de;
  padding-bottom: 0.3em;
  margin-top: 24px;
  margin-bottom: 16px;
}

.markdown-body :deep(h2) {
  font-size: 1.5em;
  font-weight: 600;
  border-bottom: 1px solid #d0d7de;
  padding-bottom: 0.3em;
  margin-top: 24px;
  margin-bottom: 16px;
}

.markdown-body :deep(h3) {
  font-size: 1.25em;
  font-weight: 600;
  margin-top: 24px;
  margin-bottom: 16px;
}

.markdown-body :deep(h4) {
  font-size: 1em;
  font-weight: 600;
  margin-top: 24px;
  margin-bottom: 16px;
}

/* Paragraphs */
.markdown-body :deep(p) {
  margin-top: 0;
  margin-bottom: 16px;
}

/* Lists */
.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  margin-top: 0;
  margin-bottom: 16px;
  padding-left: 2em;
}

.markdown-body :deep(li) {
  margin-top: 0.25em;
}

.markdown-body :deep(li > p) {
  margin-top: 16px;
}

.markdown-body :deep(li + li) {
  margin-top: 0.25em;
}

/* Code blocks */
.markdown-body :deep(pre) {
  background-color: #f6f8fa;
  border-radius: 6px;
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  margin-bottom: 16px;
}

.markdown-body :deep(pre code) {
  background-color: transparent;
  border: 0;
  padding: 0;
  font-size: 100%;
  line-height: inherit;
  word-break: normal;
}

/* Inline code */
.markdown-body :deep(code) {
  background-color: rgba(175, 184, 193, 0.2);
  border-radius: 6px;
  padding: 0.2em 0.4em;
  font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
  font-size: 85%;
}

/* Tables */
.markdown-body :deep(table) {
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
  margin-top: 0;
  margin-bottom: 16px;
  overflow: auto;
  display: block;
}

.markdown-body :deep(table tr) {
  background-color: #ffffff;
  border-top: 1px solid #d0d7de;
}

.markdown-body :deep(table tr:nth-child(2n)) {
  background-color: #f6f8fa;
}

.markdown-body :deep(table th),
.markdown-body :deep(table td) {
  border: 1px solid #d0d7de;
  padding: 6px 13px;
}

.markdown-body :deep(table th) {
  background-color: #f6f8fa;
  font-weight: 600;
  text-align: left;
}

/* Links */
.markdown-body :deep(a) {
  color: #0969da;
  text-decoration: none;
}

.markdown-body :deep(a:hover) {
  text-decoration: underline;
}

/* Blockquotes */
.markdown-body :deep(blockquote) {
  padding: 0 1em;
  color: #57606a;
  border-left: 0.25em solid #d0d7de;
  margin-top: 0;
  margin-bottom: 16px;
}

.markdown-body :deep(blockquote > :first-child) {
  margin-top: 0;
}

.markdown-body :deep(blockquote > :last-child) {
  margin-bottom: 0;
}

/* Horizontal rules */
.markdown-body :deep(hr) {
  height: 0.25em;
  padding: 0;
  margin: 24px 0;
  background-color: #d0d7de;
  border: 0;
}

/* Images */
.markdown-body :deep(img) {
  max-width: 100%;
  box-sizing: content-box;
  background-color: #ffffff;
}

/* Emoji and checkboxes */
.markdown-body :deep(input[type='checkbox']) {
  margin-right: 0.5em;
}

/* Task lists */
.markdown-body :deep(ul.contains-task-list) {
  list-style-type: none;
  padding-left: 0;
}

.markdown-body :deep(.task-list-item) {
  list-style-type: none;
}

.markdown-body :deep(.task-list-item input) {
  margin: 0 0.2em 0.25em -1.6em;
  vertical-align: middle;
}

/* Badges/Pills (like in your README) */
.markdown-body :deep(p > strong) {
  color: #0969da;
}

/* Better spacing for nested lists */
.markdown-body :deep(ul ul),
.markdown-body :deep(ul ol),
.markdown-body :deep(ol ol),
.markdown-body :deep(ol ul) {
  margin-top: 0;
  margin-bottom: 0;
}

/* Diff blocks (if you use them) */
.markdown-body :deep(.diff-addition) {
  background-color: #ccffd8;
}

.markdown-body :deep(.diff-deletion) {
  background-color: #ffd7d5;
}
</style>
