import {Component, EventEmitter, Output} from '@angular/core';
import {FilePondModule} from 'ngx-filepond';
import {FilePond, FilePondFile, FilePondOptions} from 'filepond';
import {Button} from 'primeng/button';
import {FileData} from '../../models/file-data';
import {FileUtils} from '../../../shared/utils/file-utils';

@Component({
  selector: 'app-reader-tab',
  imports: [FilePondModule, Button],
  templateUrl: './reader-tab.component.html',
  styleUrl: './reader-tab.component.scss',
  standalone: true
})
export class ReaderTabComponent {

  @Output() onLoadFileData: EventEmitter<FileData>;

  public readonly pondOptions: FilePondOptions;

  private _fileData: FileData | null;

  constructor() {
    this.pondOptions = {
      allowMultiple: false,
      labelIdle: 'Drop files here...'
    }
    this._fileData = null;
    this.onLoadFileData = new EventEmitter();
  }

  public async onAddFile(event: {
    error: any,
    file: FilePondFile,
    pond: FilePond
  }) {
    if (event.error) {
      return;
    }

    const file = event.file.file as File;
    const data = await FileUtils.getArrayBuffer(file);

    this._fileData = FileData.fromArrayBuffer(file, data);
  }

  public onLoadClick() {
    if (this._fileData) {
      this.onLoadFileData.emit(this._fileData);
    }
  }

  public get canLoad() {
    return this._fileData !== null;
  }

  public onRemoveFile() {
    this._fileData = null;
  }
}
