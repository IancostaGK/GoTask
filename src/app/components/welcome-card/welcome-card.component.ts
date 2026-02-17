import { Component } from '@angular/core';
import { TextComponent } from "../text/text.component";
import { ButtonComponent } from "../button/button.component";

@Component({
  selector: 'app-welcome-card',
  imports: [TextComponent, ButtonComponent],
  templateUrl: './welcome-card.component.html',
  styleUrl: './welcome-card.component.css'
})
export class WelcomeCardComponent {

}
