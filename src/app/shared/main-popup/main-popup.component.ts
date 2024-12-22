import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-main-popup',
  imports: [],
  templateUrl: './main-popup.component.html',
  styleUrl: './main-popup.component.scss'
})
export class MainPopupComponent{
  @Input() name!: string;
  @Input() temperature!: string;
  @Input() humidity!: number;

  @Output() temperatureUpdate = new EventEmitter<void>();
  @Output() humidityUpdate = new EventEmitter<void>();

  onTemperatureUpdate() {
    this.temperatureUpdate.emit();
  }

  onHumidityUpdate() {
    this.humidityUpdate.emit();
  }
}
