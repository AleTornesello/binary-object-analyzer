import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SequencesListComponent} from '../sequences-list/sequences-list.component';
import {Sequence} from '../../models/sequence';
import {BinaryEditorComponent, BinaryEditorMeta} from '../binary-editor/binary-editor.component';
import {FileData} from '../../models/file-data';
import {ScrollNearEndDirective} from "../../../shared/directives/scroll-near-end.directive";
import {Button} from 'primeng/button';

@Component({
  selector: 'app-sequencer-tab',
  imports: [
    SequencesListComponent,
    BinaryEditorComponent,
    Button
  ],
  templateUrl: './sequencer-tab.component.html',
  styleUrl: './sequencer-tab.component.scss',
  standalone: true,
})
export class SequencerTabComponent {
  @Input({required: true}) set fileData(fileData: FileData | null) {
    this._fileData = fileData;
    this._applyColorToSequences(this.sequences);
    this._generateBinaryEditorMeta();
  }

  get fileData() {
    return this._fileData;
  }

  @Output() onSequencesChange: EventEmitter<Sequence[]>;

  protected sequences: Sequence[];
  protected metas: (BinaryEditorMeta | null)[];

  private _fileData: FileData | null;

  private readonly _metaColors: string[] = [
    "#5295C3",
    "#F89843",
    "#5CB35C",
    "#D95556",
    "#AA89C9",
    "#A17970",
    "#E695CD",
    "#C6C652",
    "#4CCAD7"
  ];

  constructor() {
    this.onSequencesChange = new EventEmitter();
    this._fileData = null;

    this.sequences = [
      new Sequence(0, "file")
    ];

    this.metas = [];
    this._generateBinaryEditorMeta();
  }

  private _applyColorToSequences(sequences: Sequence[]) {
    sequences.forEach((sequence, index) => {
      sequence.color = this._metaColors[index % this._metaColors.length];
    });
  }

  public onSequencesListChange(sequences: Sequence[]) {
    this.sequences = sequences;
    this._applyColorToSequences(this.sequences);
    this.onSequencesChange.emit(this.sequences);
    this._generateBinaryEditorMeta();
  }

  private _generateBinaryEditorMeta() {
    this.metas = [];

    if (!this._fileData) {
      return;
    }

    const edges = this.sequences.sort((a, b) => a.address - b.address);

    // Add metas before first edge
    for (let i = 0; i < edges[0].address; i++) {
      this.metas.push(null);
    }

    for (let i = 0; i < edges.length; i++) {
      const end = i < edges.length - 1 ? edges[i + 1].address : this._fileData.data.length;
      for (let j = edges[i].address; j < end; j++) {
        this.metas.push(new BinaryEditorMeta(edges[i].address, edges[i].color, edges[i].name));
      }
    }
  }

  public onExportSequencesClick() {
    const json = JSON.stringify(this.sequences, null, 2);
    const blob = new Blob([json], {type: 'application/json'});
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sequences.json';
    link.click();
    window.URL.revokeObjectURL(url);
  }

  public onImportSequencesClick() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.click();
    input.addEventListener('change', (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = reader.result as string;
          const sequences = JSON.parse(text) as Sequence[];
          this.onSequencesListChange(sequences);
        };
        reader.readAsText(file);
      }
    });
  }
}
