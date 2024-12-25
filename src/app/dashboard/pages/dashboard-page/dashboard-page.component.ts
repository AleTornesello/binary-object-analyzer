import {Component} from '@angular/core';
import {TabsModule} from 'primeng/tabs';
import {ReaderTabComponent} from '../../components/reader-tab/reader-tab.component';
import {FileData} from '../../models/file-data';
import {SequencerTabComponent} from '../../components/sequencer-tab/sequencer-tab.component';
import {Sequence} from "../../models/sequence";

@Component({
  selector: 'app-dashboard-page',
  imports: [TabsModule, ReaderTabComponent, SequencerTabComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
  standalone: true
})
export class DashboardPageComponent {
  public fileData: FileData | null;
  public sequences: Sequence[];

  constructor() {
    this.fileData = null;
    this.sequences = [];
  }

  public onLoadFileData(fileData: FileData) {
    this.fileData = fileData;
  }

  public get canGoToSequencer() {
    return this.fileData !== null;
  }

  public get canGoToAnalyzer() {
    return this.fileData !== null;
  }

  public get canGoToExporter() {
    return this.fileData !== null;
  }

  public onSequencesChange(sequences: Sequence[]) {
    this.sequences = sequences;
  }
}
