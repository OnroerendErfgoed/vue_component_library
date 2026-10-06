import Block from 'quill/blots/block';
import { Scope, StyleAttributor } from 'parchment';

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

class IndentStyleAttributor extends StyleAttributor {
  add(node: HTMLElement, value: string | number) {
    let normalizedValue = 0;

    if (value === '+1' || value === '-1') {
      const indent = this.value(node) || 0;
      normalizedValue = value === '+1' ? indent + 1 : indent - 1;
    } else if (typeof value === 'number') {
      normalizedValue = value;
    }

    if (normalizedValue === 0) {
      this.remove(node);
      return true;
    }

    return super.add(node, `${normalizedValue * 3}em`);
  }

  value(node: HTMLElement) {
    const value = super.value(node);

    if (!value) {
      return undefined;
    }

    return parseInt(value, 10) / 3 || undefined;
  }
}

export const IndentStyle = new IndentStyleAttributor('indent', 'padding-left', {
  scope: Scope.BLOCK,
  whitelist: ['3em', '6em', '9em', '12em', '15em', '18em', '21em', '24em'],
});

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
