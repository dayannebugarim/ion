import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonInputCount } from '../core/types';

@Component({
  selector: 'ion-input-counter',
  templateUrl: './input-counter.component.html',
  styleUrls: ['./input-counter.component.scss'],
})
export class IonInputCounterComponent {
  @Input() inputSize: IonInputCount['inputSize'] = 'md';
  @Input() count = 0;
  @Output() changedValue = new EventEmitter();

  private minValue = 0;

  public emitEvent(): void {
    this.changedValue.emit({ newValue: this.count });
  }

  public countDecrement(): void {
    if (this.count > this.minValue) {
      this.count--;
      this.emitEvent();
    }
  }

  public countIncrement(): void {
    this.count++;
    this.emitEvent();
  }

  public changeCount(count: string): void {
    const countNumeric = Number(count);
    if (!isNaN(countNumeric)) {
      this.count = countNumeric;
      this.emitEvent();
    }
  }
}
