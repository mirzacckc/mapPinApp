import { AfterViewInit, Component, createComponent, EnvironmentInjector, Input, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { MapModel } from '../../core/models/map.model';
import { mapData } from '../../shared/utils/data.utils';
import { PinInfoComponent } from '../../shared/pin-info/pin-info.component';
import { UpdatePopupComponent } from '../../shared/update-popup/update-popup.component';
import { MainPopupComponent } from '../../shared/main-popup/main-popup.component';

const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
});

@Component({
  selector: 'app-map-home',
  imports: [
    PinInfoComponent
  ],
  templateUrl: './map-home.component.html',
  styleUrl: './map-home.component.scss',
})
export class MapHomeComponent implements OnInit, AfterViewInit {
  @Input() clickEventDataOnCard!: MapModel;

  private map!: L.Map
  mapGeosData = [...mapData];
  originalMapData = [...mapData];
  clickCardData!: MapModel;
  markerList: { marker: L.Marker, data: MapModel }[] = []
  private popupState: 'info' | 'temperature' | 'humidity' = 'info';

  constructor(public environmentInjector: EnvironmentInjector) {
  }

  ngOnInit() {
    this.initMap();
  }

  setValue(event: any) {
    const searchValue = event.target.value.trim().toLowerCase();
    if (searchValue) {
      this.mapGeosData = this.originalMapData.filter((value) =>
        value.name.toLowerCase().includes(searchValue)
      );
    } else {
      this.mapGeosData = [...this.originalMapData];
    }
  }

  ngAfterViewInit() {
    for (const mapData of this.mapGeosData) {
      const maker = { marker: L.marker([mapData.lat, mapData.lng], { icon }), data: mapData }
      this.markerList.push(maker)
    }

    this.markerList.forEach(item => {

      item.marker.bindPopup('', { maxWidth: 300 })
        .on('popupopen', () => this.updatePopupContent(item))
        .addTo(this.map);

      item.marker.on('click', () => {
        this.setBlueBorderCard(item.data.id)
        if (!item.marker.isPopupOpen()) {
          item.marker.closePopup();
        } else {
          item.marker.openPopup();
        }
      });
    });
  }

  setBlueBorderCard(id: number): void {
    this.mapGeosData.forEach(pin => {
      if (pin.id !== id) {
        pin.isBlueBorder = false;
      }
    });

    const item = this.mapGeosData.find(pin => pin.id === id);
    if (item) {
      item.isBlueBorder = !item.isBlueBorder;
    }
  }

  private initMap() {
    this.map = L.map("map").setView([39.917090, 32.855477], 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);
  }

  setClickCardData(res: MapModel) {
    this.clickCardData = res;
    this.markerList.forEach(item => {
      if (item.data.id === res.id) {


        if (!item.marker.getPopup()) {
          item.marker.bindPopup('', { maxWidth: 300 })
            .on('popupopen', () => this.updatePopupContent(item))
            .addTo(this.map);
        }

        if (!this.map.hasLayer(item.marker)) {
          item.marker.addTo(this.map);
        }

        this.map.flyTo(item.marker.getLatLng(), 16, { duration: 1.5 });
        this.setBlueBorderCard(item.data.id)
        if (item.marker.isPopupOpen()) {
          this.map.flyTo(item.marker.getLatLng(), 5, { duration: 1.5 });
          item.marker.closePopup();
        } else {
          item.marker.openPopup();
        }
      }
    });
  }

  updatePopupContent(item: any) {

    const popupContainer = document.createElement('div');

    if (this.popupState === 'info') {
      const infoComponent = createComponent(MainPopupComponent, {
        environmentInjector: this.environmentInjector,
      });

      infoComponent.setInput('name', item.data.name);
      infoComponent.setInput('temperature', item.data.temperature);
      infoComponent.setInput('humidity', item.data.humidity);

      infoComponent.changeDetectorRef.detectChanges();

      infoComponent.instance.temperatureUpdate.subscribe(() => {
        this.popupState = 'temperature';
        this.updatePopupContent(item);
      });

      infoComponent.instance.humidityUpdate.subscribe(() => {
        this.popupState = 'humidity';
        this.updatePopupContent(item);
      });

      popupContainer.appendChild(infoComponent.location.nativeElement);
    } else if (this.popupState === 'temperature' || this.popupState === 'humidity') {
      const updateComponent = createComponent(UpdatePopupComponent, {
        environmentInjector: this.environmentInjector,
      });

      updateComponent.setInput(
        'currentValue',
        this.popupState === 'temperature' ? item.data.temperature : item.data.humidity
      );
      updateComponent.setInput('updateType', this.popupState);
      updateComponent.setInput('name', item.data.name);

      updateComponent.changeDetectorRef.detectChanges();

      updateComponent.instance.update.subscribe((newValue: number) => {
        if (this.popupState === 'temperature') {
          item.data.temperature = newValue;
        } else {
          item.data.humidity = newValue;
        }

        this.popupState = 'info';
        this.updatePopupContent(item);
      });

      updateComponent.instance.cancel.subscribe(() => {
        this.popupState = 'info';
        this.updatePopupContent(item);
        this.setBlueBorderCard(item.data.id)
      });

      popupContainer.appendChild(updateComponent.location.nativeElement);
    }

    if (!item.marker.isPopupOpen()) {
      item.marker.setPopupContent(popupContainer);
      item.marker.openPopup();
    } else {
      item.marker.setPopupContent(popupContainer);
      item.marker.update();
    }
  }
}
