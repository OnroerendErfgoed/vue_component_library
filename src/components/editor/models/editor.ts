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
  toolbar?: OeEditorToolbar[];
  enableFullToolbar?: boolean;
  formats?: OeEditorFormat[];
  enableAllFormats?: boolean;
}

export enum OeEditorFormat {
  BACKGROUND = 'background',
  BOLD = 'bold',
  COLOR = 'color',
  FONT = 'font',
  CODE = 'code',
  ITALIC = 'italic',
  LINK = 'link',
  SIZE = 'size',
  STRIKE = 'strike',
  SCRIPT = 'script',
  UNDERLINE = 'underline',
  BLOCKQUOTE = 'blockquote',
  HEADER = 'header',
  INDENT = 'indent',
  LIST = 'list',
  ALIGN = 'align',
  DIRECTION = 'direction',
  CODE_BLOCK = 'code-block',
  FORMULA = 'formula',
  IMAGE = 'image',
  VIDEO = 'video',
  PRIVATE = 'private',
  BIBLIO = 'biblio',
  FULLSCREEN = 'fullscreen',
}

export enum OeEditorToolbar {
  UNDO = 'undo',
  REDO = 'redo',
  HEADER = 'header',
  BLOCKQUOTE = 'blockquote',
  CODEBLOCK = 'codeblock',
  BOLD = 'bold',
  ITALIC = 'italic',
  UNDERLINE = 'underline',
  STRIKE = 'strike',
  COLOR = 'color',
  BACKGROUND = 'background',
  SUB = 'sub',
  SUPER = 'super',
  BULLIST = 'bullist',
  NUMLIST = 'numlist',
  OUTDENT = 'outdent',
  INDENT = 'indent',
  ALIGN = 'align',
  REMOVEFORMAT = 'removeformat',
  PRIVATE = 'private',
  BIBLIO = 'biblio',
  CODE = 'code',
  FULLSCREEN = 'fullscreen',
  LINK = 'link',
  IMAGE = 'image',
  VIDEO = 'video',
  FORMULA = 'formula',
}
