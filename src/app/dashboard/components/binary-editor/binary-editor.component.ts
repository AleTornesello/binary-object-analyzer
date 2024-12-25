import {Component, Input} from '@angular/core';
import {FileData} from '../../models/file-data';
import {CommonModule} from '@angular/common';

class BinaryRow {
  offset: number;
  cells: BinaryCell[];

  get label() {
    return `0x${this.offset.toString(16).padStart(8, '0')}`;
  }

  constructor(offset: number, cells: BinaryCell[]) {
    this.offset = offset;
    this.cells = cells;
  }
}

class BinaryCell {
  value: number;
  offset: number;

  get label() {
    return this.value.toString(16).padStart(2, '0');
  }

  get ascii() {
    if (this.value < 32 || this.value > 126) {
      return '.';
    }
    return String.fromCharCode(this.value);
  }

  get isNull() {
    return this.value === 0;
  }

  constructor(value: number, offset: number) {
    this.value = value;
    this.offset = offset;
  }
}

@Component({
  selector: 'app-binary-editor',
  imports: [CommonModule],
  templateUrl: './binary-editor.component.html',
  styleUrl: './binary-editor.component.scss',
  standalone: true
})
export class BinaryEditorComponent {
  @Input() set fileData(fileData: FileData | null) {
    this._fileData = fileData;
    this.resetPaging();
    this._initializeBinaryRows();
  }
  @Input() set originalOffset(offset: number) {
    this._originalOffset = offset;
    this.calculatePaddedOffset();
    this.resetPaging();
    this._initializeBinaryRows();
  }
  @Input() enablePaging: boolean;
  @Input() pageSize: number;

  protected binaryRows: BinaryRow[];

  private _fileData: FileData | null;
  private _lastPage: number;
  private _originalOffset: number;
  private _paddedOffset: number;

  constructor() {
    this._fileData = null;
    this._originalOffset = 0;
    this._paddedOffset = 0;
    this.enablePaging = false;
    this.pageSize = 50;
    this.binaryRows = [];
    this._lastPage = 0;
    this._initializeBinaryRows();
  }

  private _initializeBinaryRows()  {
    if (!this._fileData) {
      this.binaryRows = [
        new BinaryRow(this._paddedOffset, [])
      ];
      return;
    }

    this._loadNextPage();
  }

  private _loadNextPage() {
    if(!this._fileData) {
      return;
    }

    if(this._lastPage * this.pageSize >= this._fileData.data.length) {
      return;
    }

    this._lastPage++;

    let start = (this._lastPage - 1) * this.pageSize;

    let end = start + this.pageSize;

    if(!this.enablePaging) {
      end = this._fileData.data.length;
    }

    const rows = new Array<BinaryRow>(end - start);
    for (let i = start; i < end; i++) {
      const offset = this._paddedOffset + (i * 16);
      const cells = new Array<BinaryCell>(16);
      for (let j = 0; j < 16; j++) {
        const value = this._fileData.data[offset + j];
        cells[j] = new BinaryCell(value, offset + j);
      }
      rows[i - start] = new BinaryRow(offset, cells);
    }
    this.binaryRows = this.binaryRows.concat(rows);
  }

  public loadMore() {
    this._loadNextPage();
  }

  public resetPaging() {
    this._lastPage = 0;
    this.binaryRows = [];
  }

  // If the original offset is not a multiple of 16,
  // add padding to the left
  public calculatePaddedOffset() {
    this._paddedOffset = this._originalOffset;
    if (this._originalOffset % 16 !== 0) {
      this._paddedOffset -= this._originalOffset % 16;
    }
  }

  public isCellInRange(cell: BinaryCell) {
    return cell.offset >= this._originalOffset;
  }
}
