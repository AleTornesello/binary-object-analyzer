import {Directive, ElementRef, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';

@Directive({
  selector: '[appScrollNearEnd]',
  standalone: true,
})
export class ScrollNearEndDirective {

  /**
   * threshold in PX when to emit before page end scroll
   */
  @Input() threshold: number;

  @Output() nearEnd: EventEmitter<void>;

  constructor(private _el: ElementRef) {
    this.threshold = 120;
    this.nearEnd = new EventEmitter();
  }

  @HostListener('scroll')
  public windowScrollEvent() {
    if (this._el.nativeElement.scrollHeight - (this._el.nativeElement.clientHeight + this._el.nativeElement.scrollTop) <= this.threshold) {
      this.nearEnd.emit();
    }
  }
}
