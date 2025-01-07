import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Sequence} from '../../models/sequence';
import {SequencesListItemComponent} from '../sequences-list-item/sequences-list-item.component';

@Component({
  selector: 'app-sequences-list',
  imports: [
    SequencesListItemComponent
  ],
  templateUrl: './sequences-list.component.html',
  styleUrl: './sequences-list.component.scss',
  standalone: true
})
export class SequencesListComponent {
  @Input() sequences: Sequence[];

  @Output() sequencesChange: EventEmitter<Sequence[]>;

  protected selectedSequenceIndex: number;

  constructor() {
    this.sequences = [
      new Sequence(0, "file")
    ];
    this.selectedSequenceIndex = 0;
    this.sequencesChange = new EventEmitter<Sequence[]>();
  }

  public onAddSequenceClick() {
    const maxAddressSequence = this.sequences.reduce((a, b) => a.address > b.address ? a : b);
    this.sequences.push(new Sequence(maxAddressSequence.address + 1, "file"));
    this.sequencesChange.emit(this.sequences);
  }

  public onSequenceChange(index: number, sequence: Sequence) {
    this.sequences[index] = sequence;
    this.sequencesChange.emit(this.sequences);
  }
}
