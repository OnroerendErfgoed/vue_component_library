import Quill from 'quill';
import Block from 'quill/blots/block';
import Module from 'quill/core/module';

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

export class CustomModule extends Module {
  private q: Quill;
  private draggedIndex: number | null = null;
  private draggedHTML = '';
  private currentDropTarget: HTMLElement | null = null;

  constructor(quill: Quill) {
    super(quill);
    this.q = quill;
    const parentNode = this.q.root.parentNode;
    parentNode.style.position = parentNode.style.position || 'relative';
    this.q.root.parentNode.addEventListener('dragstart', this.handleDragstart, true);
    this.q.root.parentNode.addEventListener('dragend', this.handleDragend, true);
    this.q.root.addEventListener('dragover', this.handleDragover, false);
    this.q.root.addEventListener('dragleave', this.handleDragleave, false);
    this.q.root.addEventListener('drop', this.handleDrop, false);
  }

  handleDragstart = (evt: DragEvent) => {
    const target = (evt.target as HTMLElement) || null;
    if (!target) return;

    const container = target.tagName === 'IMG' ? (target.parentElement as HTMLElement) : target;
    const isImageAlign =
      container.classList?.contains('ql-image-align-left') ||
      container.classList?.contains('ql-image-align-right') ||
      container.classList?.contains('ql-image-align-center');

    if (isImageAlign) {
      evt.stopPropagation();
      const blot = Quill.find(container);
      if (!blot) return;
      this.draggedIndex = this.q.getIndex(blot as any);
      this.draggedHTML = container.outerHTML;
      container.style.opacity = '0.4';
      container.style.cursor = 'grabbing';
      this.q.root.classList.add('oe-image-dragging');
      if (evt.dataTransfer) {
        evt.dataTransfer.effectAllowed = 'move';
        evt.dataTransfer.setData('text/html', this.draggedHTML);
      }
    }
  };

  handleDragover = (evt: DragEvent) => {
    if (!this.draggedHTML) return;
    evt.preventDefault();
    if (evt.dataTransfer) {
      evt.dataTransfer.dropEffect = 'move';
    }
    this.highlightDropTarget(evt);
  };

  handleDrop = (evt: DragEvent) => {
    if (this.draggedIndex === null || !this.draggedHTML) return;

    evt.preventDefault();
    evt.stopPropagation();

    this.clearDropHighlight();
    this.q.root.classList.remove('oe-image-dragging');

    // Find the drop target element
    const target = evt.target as HTMLElement | null;
    if (!target) return;
    const dropTarget = target.closest('p, div, li, blockquote, h1, h2, h3, h4, h5, h6') as HTMLElement | null;
    if (!dropTarget) return;

    // Get the index of the drop target
    const dropBlot = Quill.find(dropTarget);
    if (!dropBlot) return;
    let dropIndex = this.q.getIndex(dropBlot as any);

    // Remove old element first
    this.q.deleteText(this.draggedIndex, 1, Quill.sources.USER);

    // Adjust drop index if we removed text before it
    if (dropIndex > this.draggedIndex) {
      dropIndex = dropIndex - 1;
    }

    this.q.clipboard.dangerouslyPasteHTML(dropIndex, this.draggedHTML, Quill.sources.USER);
    this.q.setSelection(dropIndex + 1, 0, Quill.sources.SILENT);

    // Reset
    this.draggedIndex = null;
    this.draggedHTML = '';
  };

  handleDragleave = () => {
    this.clearDropHighlight();
  };

  handleDragend = () => {
    if (this.draggedIndex !== null) {
      const containers = this.q.root.querySelectorAll('[class^="ql-image-align-"]');
      containers.forEach((el) => ((el as HTMLElement).style.opacity = ''));
    }
    this.q.root.classList.remove('oe-image-dragging');
    this.draggedIndex = null;
    this.draggedHTML = '';
    this.clearDropHighlight();
  };

  private highlightDropTarget(evt: DragEvent) {
    const target = evt.target as HTMLElement | null;
    if (!target) return;
    const root = this.q.root as HTMLElement;

    const dropTarget = target.closest('p, div, li, blockquote, h1, h2, h3, h4, h5, h6') as HTMLElement | null;

    if (this.currentDropTarget && this.currentDropTarget !== dropTarget) {
      this.currentDropTarget.classList.remove('oe-image-drop-target');
    }

    if (dropTarget && root.contains(dropTarget)) {
      this.currentDropTarget = dropTarget;
      this.currentDropTarget.classList.add('oe-image-drop-target');
    } else {
      this.currentDropTarget = null;
    }
  }

  private clearDropHighlight() {
    if (this.currentDropTarget) {
      this.currentDropTarget.classList.remove('oe-image-drop-target');
    }
    this.currentDropTarget = null;
  }
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
