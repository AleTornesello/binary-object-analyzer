import {Component, DestroyRef, EventEmitter, Input, Output} from '@angular/core';
import {Sequence} from '../../models/sequence';
import {InputText} from 'primeng/inputtext';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InputNumber} from 'primeng/inputnumber';
import {NgClass} from '@angular/common';
import {Button} from 'primeng/button';
import {Inplace} from "primeng/inplace";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {HexlifyPipe} from '../../../shared/pipes/hexlify.pipe';

@Component({
  selector: 'app-sequences-list-item',
  imports: [
    InputText,
    FormsModule,
    Button,
    Inplace,
    ReactiveFormsModule,
    HexlifyPipe
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
  @Input() hideDeleteButton: boolean;

  @Output() sequenceChange: EventEmitter<Sequence>;
  @Output() deleteSequence: EventEmitter<void>;

  protected form: FormGroup;

  private _sequence!: Sequence;

  constructor(
    private _destroyRef: DestroyRef
  ) {
    this.sequenceChange = new EventEmitter();
    this.deleteSequence = new EventEmitter();
    this.form = this._initForm();
    this.hideDeleteButton = false;
  }

  private _initForm(sequence?: Sequence) {
    const form = new FormGroup({
      name: new FormControl(sequence?.name),
      address: new FormControl(sequence?.address.toString(16))
    });

    form.valueChanges
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(() => {
        this.sequenceChange.emit(this.sequence);
      });

    return form;
  }

  public onConfirmNameChange() {
    this._emitSequenceChange();
  }

  public onConfirmAddressChange() {
    this._emitSequenceChange();
  }

  private _emitSequenceChange() {
    let address = this.form.get("address")!.value;

    if (typeof address === "string") {
      address = parseInt(this.form.get("address")!.value, 16);
    }

    this.sequenceChange.emit({
      address,
      name: this.form.get("name")!.value
    });
  }

  public onBeforeAddressInput(event: InputEvent) {
    if (!event.data) {
      return;
    }
    // If the input character is not a hex digit, prevent the input
    if (!event.data.match(/^[0-9a-fA-F]+$/)) {
      event.preventDefault();
    }
  }

  public onDeleteClick() {
    this.deleteSequence.emit();
  }
}
