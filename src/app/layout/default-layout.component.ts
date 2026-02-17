import { Component } from '@angular/core';
import { HeaderComponent } from '../components/header/header.component';
import { MainContentComponent } from '../components/main-content/main-content.component';

@Component({
  selector: 'app-default-layout',
  imports: [HeaderComponent, MainContentComponent],
  templateUrl: './default-layout.component.html',
  styleUrl: './default-layout.component.css'
})
export class DefaultLayoutComponent {

}
