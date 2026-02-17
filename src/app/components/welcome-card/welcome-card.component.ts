import { Component } from '@angular/core';
import { TextComponent } from "../text/text.component";

@Component({
  selector: 'app-welcome-card',
  imports: [TextComponent],
  templateUrl: './welcome-card.component.html',
  styleUrl: './welcome-card.component.css'
})
export class WelcomeCardComponent {

}
