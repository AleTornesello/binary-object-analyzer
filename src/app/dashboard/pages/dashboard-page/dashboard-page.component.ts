import {Component} from '@angular/core';
import {TabsModule} from 'primeng/tabs';
import {ReaderTabComponent} from '../../components/reader-tab/reader-tab.component';
import {FileData} from '../../models/file';

@Component({
  selector: 'app-dashboard-page',
  imports: [TabsModule, ReaderTabComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
  standalone: true
})
export class DashboardPageComponent {
  public fileData: FileData | null;

  constructor() {
    this.fileData = null;
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
}
