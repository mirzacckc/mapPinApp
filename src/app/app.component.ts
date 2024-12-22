import { Component } from '@angular/core';
import { NavBarComponent } from './shared/nav-bar/nav-bar.component';
import { MapHomeComponent } from './pages/map-home/map-home.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [NavBarComponent, MapHomeComponent,FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'map-pin-app';
}
