import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-popup',
  imports: [
    FormsModule,
  ],
  templateUrl: './update-popup.component.html',
  styleUrl: './update-popup.component.scss',
})
export class UpdatePopupComponent {
  @Input() currentValue!: number;
  @Input() name!: string;
  @Input() updateType!: 'temperature' | 'humidity';

  @Output() update = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();

  newValue!: string;

  onUpdate() {
    if (this.newValue) {
      this.update.emit(this.newValue);
    }
  }

  onCancel() {
    this.cancel.emit();
  }

  setValue($event: any) {
    this.newValue = $event.target.value;
  }
}
