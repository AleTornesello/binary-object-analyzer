import {Component, ElementRef, Input} from '@angular/core';
import {FileData} from '../../models/file-data';
import {CommonModule} from '@angular/common';
import {HexlifyPipe} from "../../../shared/pipes/hexlify.pipe";
import {AsciiPipe} from "../../../shared/pipes/ascii.pipe";

export class BinaryEditorMeta {
  address: number;
  color?: string;
  label?: string;

  constructor(address: number, color?: string, label?: string) {
    this.address = address;
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

  @Input() set address(address: number) {
    this._address = address;
    this.calculatePaddedAddress();
    this._updateLocalScrollVariables();
  }

  @Input() set metas(metas: (BinaryEditorMeta | null)[]) {
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

  protected paddedAddress: number;

  private _fileData: FileData | null;
  private _address: number;
  private _metas: (BinaryEditorMeta | null)[];
  private _maxHeight: number | null;

  // Local scroll variables
  protected editorScrollbarHeight: number;
  private _rowsToRender: number;
  private _rowsStartAddress: number;

  // Style
  protected readonly lineHeight: number = 19;

  constructor() {
    this._fileData = null;
    this._address = 0;
    this.paddedAddress = 0;
    this._metas = [];
    this.editorScrollbarHeight = 0;
    this._rowsToRender = 0;
    this._rowsStartAddress = 0;
    this._maxHeight = null;
  }

  get visibleBinaryCells(): Uint8Array {
    if (!this._fileData) {
      return new Uint8Array(0);
    }

    const startRowAddress = this._rowsStartAddress + this.paddedAddress;
    // Convert rows to elements count (16 elements per row)
    const length = this._rowsToRender * 16;
    return this._fileData.data.slice(startRowAddress, startRowAddress + length);
  }

  get visibleMetas(): (BinaryEditorMeta | null)[] {
    const startRowAddress = this._rowsStartAddress + this.paddedAddress;
    // Convert rows to elements count (16 elements per row)
    const length = this._rowsToRender * 16;
    return this._metas.slice(startRowAddress, startRowAddress + length);
  }

  // If the origin address is not a multiple of 16,
  // add padding to the left
  public calculatePaddedAddress() {
    this.paddedAddress = this._address;
    if (this._address % 16 !== 0) {
      this.paddedAddress -= this._address % 16;
    }
  }

  public get addresses() {
    const startRowAddress = this._rowsStartAddress + this.paddedAddress;
    let length = this._rowsToRender;

    // If the end address is over the file data possible addresses, because
    // of a possible end padding of the editor, reduce the length
    if (this._fileData && (startRowAddress / 16) + length > Math.ceil(this._fileData.data.length / 16)) {
      length--;
    }

    return new Array(length).fill(null).map((_, i) => (i * 16) + startRowAddress);
  }

  public onScrollbarScroll(e: Event) {

    // Get scrollbar position
    const scrollbarPosition = (e.target as HTMLDivElement).scrollTop;

    // Calculate start row address
    const startRowAddress = Math.floor(scrollbarPosition / 19) * 16;

    this._rowsStartAddress = startRowAddress;
  }

  private _updateLocalScrollVariables() {
    if (!this._fileData) {
      return;
    }

    const allElementsCount = this._fileData.data.length;
    // Remove items that are before the start address
    const availableElementsCount = allElementsCount - this.paddedAddress;

    // Convert elements to rows
    const availableRowsCount = Math.ceil(availableElementsCount / 16);

    // Multiply rows by line height
    this.editorScrollbarHeight = availableRowsCount * this.lineHeight;

    if (this.maxHeight !== null && (this.maxHeight % this.lineHeight) !== 0) {
      this.editorScrollbarHeight += this.lineHeight - (this.maxHeight % this.lineHeight);
    }

    // Subtract line height of the header
    const editorHeight = Math.min(availableRowsCount * this.lineHeight, this._maxHeight ?? Infinity) - this.lineHeight;

    this._rowsToRender = Math.ceil(editorHeight / this.lineHeight);
  }
}
