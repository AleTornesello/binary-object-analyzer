import {Component, ElementRef, Input} from '@angular/core';
import {FileData} from '../../models/file-data';
import {CommonModule} from '@angular/common';
import {HexlifyPipe} from "../../../shared/pipes/hexlify.pipe";
import {AsciiPipe} from "../../../shared/pipes/ascii.pipe";

export class BinaryEditorMeta {
  offset: number;
  length: number;
  color?: string;
  label?: string;

  constructor(offset: number, length: number, color?: string, label?: string) {
    this.offset = offset;
    this.length = length;
    this.color = color;
    this.label = label;
  }
}

@Component({
  selector: 'app-binary-editor',
  imports: [CommonModule, HexlifyPipe, AsciiPipe],
  templateUrl: './binary-editor.component.html',
  styleUrl: './binary-editor.component.scss',
  standalone: true,
})
export class BinaryEditorComponent {

  @Input() set fileData(fileData: FileData | null) {
    this._fileData = fileData;
    this._updateLocalScrollVariables();
  }

  @Input() set originalOffset(offset: number) {
    this._originalOffset = offset;
    this.calculatePaddedOffset();
    this._updateLocalScrollVariables();
  }

  @Input() set metas(metas: BinaryEditorMeta[]) {
    this._metas = metas;
    // this._updateCellsMetas();
  }

  @Input() set maxHeight(maxHeight: number | null) {
    this._maxHeight = maxHeight;
    this._updateLocalScrollVariables();
  }

  get maxHeight() {
    return this._maxHeight;
  }

  protected paddedOffset: number;

  private _fileData: FileData | null;
  private _originalOffset: number;
  private _metas: BinaryEditorMeta[];
  private _maxHeight: number | null;

  // Local scroll variables
  protected editorScrollbarHeight: number;
  private _rowsToRender: number;
  private _rowsStartOffset: number;

  constructor() {
    this._fileData = null;
    this._originalOffset = 0;
    this.paddedOffset = 0;
    this._metas = [];
    this.editorScrollbarHeight = 0;
    this._rowsToRender = 0;
    this._rowsStartOffset = 0;
    this._maxHeight = null;
  }

  get binaryCells(): Uint8Array {
    if (!this._fileData) {
      return new Uint8Array(0);
    }

    const startRowOffset = this._rowsStartOffset + this.paddedOffset;
    // Convert rows to elements count (16 elements per row)
    const length = this._rowsToRender * 16;
    return this._fileData.data.slice(startRowOffset, startRowOffset + length);
  }

  // If the original offset is not a multiple of 16,
  // add padding to the left
  public calculatePaddedOffset() {
    this.paddedOffset = this._originalOffset;
    if (this._originalOffset % 16 !== 0) {
      this.paddedOffset -= this._originalOffset % 16;
    }
  }

  public get offsets() {
    const startRowOffset = this._rowsStartOffset + this.paddedOffset;
    let length = this._rowsToRender;

    // If the end address is over the file data possible addresses, because
    // of a possible end padding of the editor, reduce the length
    if (this._fileData && (startRowOffset / 16) + length > Math.ceil(this._fileData.data.length / 16)) {
      length--;
    }

    return new Array(length).fill(null).map((_, i) => (i * 16) + startRowOffset);
  }

  public onScrollbarScroll(e: Event) {

    // Get scrollbar position
    const scrollbarPosition = (e.target as HTMLDivElement).scrollTop;

    // Calculate start row offset
    const startRowOffset = Math.floor(scrollbarPosition / 20) * 16;

    console.log("scrollbarPosition", scrollbarPosition, "startRowOffset", startRowOffset);

    this._rowsStartOffset = startRowOffset;
  }

  private _updateLocalScrollVariables() {
    if (!this._fileData) {
      return;
    }

    const allElementsCount = this._fileData.data.length;
    // Remove items that are before the start offset
    const availableElementsCount = allElementsCount - this.paddedOffset;

    // Convert elements to rows
    const availableRowsCount = Math.ceil(availableElementsCount / 16);

    // Multiply rows by 20px (height of a row)
    this.editorScrollbarHeight = availableRowsCount * 20;

    if (this.maxHeight !== null && (this.maxHeight % 20) !== 0) {
      this.editorScrollbarHeight += 20 - (this.maxHeight % 20);
    }

    // Subtract 20px of the header
    const editorHeight = Math.min(availableRowsCount * 20, this._maxHeight ?? Infinity) - 20;

    this._rowsToRender = Math.ceil(editorHeight / 20);
  }
}
