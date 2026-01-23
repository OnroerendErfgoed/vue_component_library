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
  private static readonly BLOCK_SELECTOR = 'p, div, li, blockquote, h1, h2, h3, h4, h5, h6';
  private static readonly ALIGNED_IMAGE_CLASSES = [
    'ql-image-align-left',
    'ql-image-align-right',
    'ql-image-align-center',
  ];

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
    const target = evt.target as HTMLElement;
    if (!target || target.tagName !== 'IMG') return;

    evt.stopPropagation();

    const container = target.parentElement as HTMLElement;
    const isAlignedImage = CustomModule.ALIGNED_IMAGE_CLASSES.some((cls) => container.classList?.contains(cls));
    const dragElement = isAlignedImage ? container : target;

    const blot = Quill.find(dragElement);
    if (!blot) return;

    this.draggedIndex = this.q.getIndex(blot as any);
    this.draggedHTML = dragElement.outerHTML;
    dragElement.style.opacity = '0.4';
    dragElement.style.cursor = 'grabbing';
    this.q.root.classList.add('oe-image-dragging');

    if (evt.dataTransfer) {
      evt.dataTransfer.effectAllowed = 'move';
      evt.dataTransfer.setData('text/html', this.draggedHTML);
    }
  };

  handleDragover = (evt: DragEvent) => {
    if (!this.draggedHTML) return;
    evt.preventDefault();
    evt.dataTransfer!.dropEffect = 'move';
    this.highlightDropTarget(evt);
  };

  handleDrop = (evt: DragEvent) => {
    if (this.draggedIndex === null || !this.draggedHTML) return;

    evt.preventDefault();
    evt.stopPropagation();

    const target = evt.target as HTMLElement;
    const dropTarget = target.closest(CustomModule.BLOCK_SELECTOR) as HTMLElement | null;
    if (!dropTarget) return;

    const dropBlot = Quill.find(dropTarget);
    if (!dropBlot) return;

    let dropIndex = this.q.getIndex(dropBlot as any);
    this.q.deleteText(this.draggedIndex, 1, Quill.sources.USER);

    if (dropIndex > this.draggedIndex) {
      dropIndex--;
    }

    this.q.clipboard.dangerouslyPasteHTML(dropIndex, this.draggedHTML, Quill.sources.USER);
    this.q.setSelection(dropIndex + 1, 0, Quill.sources.SILENT);
    this.cleanup();
  };

  handleDragleave = () => {
    this.clearDropHighlight();
  };

  handleDragend = () => {
    this.cleanup();
  };

  private highlightDropTarget(evt: DragEvent) {
    const target = evt.target as HTMLElement;
    const dropTarget = target.closest(CustomModule.BLOCK_SELECTOR) as HTMLElement | null;

    if (this.currentDropTarget !== dropTarget) {
      this.currentDropTarget?.classList.remove('oe-image-drop-target');
      this.currentDropTarget = null;
    }

    if (dropTarget && this.q.root.contains(dropTarget)) {
      this.currentDropTarget = dropTarget;
      this.currentDropTarget.classList.add('oe-image-drop-target');
    }
  }

  private clearDropHighlight() {
    this.currentDropTarget?.classList.remove('oe-image-drop-target');
    this.currentDropTarget = null;
  }

  private cleanup() {
    const containers = this.q.root.querySelectorAll('[class^="ql-image-align-"]');
    containers.forEach((el) => ((el as HTMLElement).style.opacity = ''));
    this.q.root.classList.remove('oe-image-dragging');
    this.clearDropHighlight();
    this.draggedIndex = null;
    this.draggedHTML = '';
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
