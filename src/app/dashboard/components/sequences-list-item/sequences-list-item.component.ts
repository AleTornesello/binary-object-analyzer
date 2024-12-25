import {Component, DestroyRef, EventEmitter, Input, Output} from '@angular/core';
import {Sequence} from '../../models/sequence';
import {InputText} from 'primeng/inputtext';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InputNumber} from 'primeng/inputnumber';
import {NgClass} from '@angular/common';
import {Button} from 'primeng/button';
import {Inplace} from "primeng/inplace";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-sequences-list-item',
  imports: [
    InputText,
    FormsModule,
    InputNumber,
    NgClass,
    Button,
    Inplace,
    ReactiveFormsModule
  ],
  templateUrl: './sequences-list-item.component.html',
  styleUrl: './sequences-list-item.component.scss',
  standalone: true
})
export class SequencesListItemComponent {

  @Input({required: true}) set sequence(sequence: Sequence) {
    this._sequence = sequence;
    this.form = this._initForm(sequence);
  }

  get sequence() {
    return this._sequence;
  }

  @Input({required: true}) id!: number;
  @Input() selected: boolean;

  @Output() sequenceChange: EventEmitter<Sequence>;
  @Output() onSelect: EventEmitter<number>;

  protected form: FormGroup;

  private _sequence!: Sequence;

  constructor(
    private _destroyRef: DestroyRef
  ) {
    this.selected = false;
    this.sequenceChange = new EventEmitter<Sequence>();
    this.onSelect = new EventEmitter<number>();
    this.form = new FormGroup({});
  }

  private _initForm(sequence?: Sequence) {
    const form = new FormGroup({
      name: new FormControl(sequence?.name),
      offset: new FormControl(sequence?.offset)
    });

    form.valueChanges
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(() => {
        this.sequenceChange.emit(this.sequence);
      });

    return form;
  }

  public onSelectSequenceClick() {
    this.onSelect.emit(this.id);
  }

  public onConfirmNameChange() {
    this._emitSequenceChange();
  }

  public onConfirmOffsetChange() {
    this._emitSequenceChange();
  }

  private _emitSequenceChange() {
    this.sequenceChange.emit({
      offset: this.form.get("offset")!.value,
      name: this.form.get("name")!.value
    });
  }
}
