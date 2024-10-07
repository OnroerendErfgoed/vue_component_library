import Block from 'quill/blots/block';

export class PrivateBlock extends Block {
  static tagName = 'DIV';
  static className = 'prive';
  static blotName = 'private';
}

export class BibliografieBlock extends Block {
  static tagName = 'DIV';
  static className = 'biblio';
  static blotName = 'biblio';
}

export interface OeEditorProps {
  id: string;
  height?: number;
  modDisabled?: boolean;
  toolbar?: OeEditorToolbarConfig;
}

export interface OeEditorToolbarConfig {
  undo?: boolean;
  redo?: boolean;
  header?: boolean;
  blockquote: boolean;
  codeblock: boolean;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  color?: boolean;
  background?: boolean;
  sub?: boolean;
  super?: boolean;
  bullist?: boolean;
  numlist?: boolean;
  outdent?: boolean;
  indent?: boolean;
  align?: boolean;
  removeformat?: boolean;
  private?: boolean;
  biblio?: boolean;
  code?: boolean;
  fullscreen?: boolean;
  link?: boolean;
  image?: boolean;
  video?: boolean;
  formula?: boolean;
}
