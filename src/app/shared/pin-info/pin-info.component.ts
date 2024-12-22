import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { MapModel } from '../../core/models/map.model';

@Component({
  selector: 'app-pin-info',
  imports: [
    DatePipe,
    NgClass,
  ],
  templateUrl: './pin-info.component.html',
  styleUrl: './pin-info.component.scss'
})
export class PinInfoComponent implements OnInit {
  @Input() pinInfosData!: MapModel[];
  @Output() pinInfosClick = new EventEmitter<MapModel>();

  time!: Date;

  ngOnInit(): void {
    this.time = new Date();
  }


  onClickCard(data: MapModel) {
    this.pinInfosClick.emit(data)
    this.setBlueBorder(data.id)
  }

  setBlueBorder(id: number): void {
    this.pinInfosData.forEach(pin => {
      if (pin.id !== id) {
        pin.isBlueBorder = false;
      }else {
        this.pinInfosData[pin.id].isBlueBorder = !pin.isBlueBorder;
      }
    });
  }
}
