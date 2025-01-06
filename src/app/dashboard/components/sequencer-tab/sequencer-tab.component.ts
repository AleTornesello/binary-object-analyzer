import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {SequencesListComponent} from '../sequences-list/sequences-list.component';
import {Sequence} from '../../models/sequence';
import {BinaryEditorComponent} from '../binary-editor/binary-editor.component';
import {FileData} from '../../models/file-data';
import {ScrollNearEndDirective} from "../../../shared/directives/scroll-near-end.directive";

@Component({
  selector: 'app-sequencer-tab',
  imports: [
    SequencesListComponent,
    BinaryEditorComponent,
    ScrollNearEndDirective
  ],
  templateUrl: './sequencer-tab.component.html',
  styleUrl: './sequencer-tab.component.scss',
  standalone: true,
})
export class SequencerTabComponent {
  @ViewChild('binaryEditor') binaryEditor?: BinaryEditorComponent;

  @Input({required: true}) set fileData(fileData: FileData | null) {
    this._fileData = fileData;
  }
  get fileData() {
    return this._fileData;
  }

  @Output() onSequencesChange: EventEmitter<Sequence[]>;

  protected sequences: Sequence[];

  private _selectedSequenceIndex: number;
  private _fileData: FileData | null

  constructor() {
    this.onSequencesChange = new EventEmitter();
    this._fileData = null;

    this.sequences = [
      new Sequence(0, "file")
    ];
    this._selectedSequenceIndex = 0;
  }

  public onSequenceSelect(index: number) {
    this._selectedSequenceIndex = index;
  }

  public get selectedSequence() {
    return this.sequences[this._selectedSequenceIndex];
  }

  public onSequencesListChange(sequences: Sequence[]) {
    this.sequences = sequences;
    this.onSequencesChange.emit(this.sequences);
  }
}
