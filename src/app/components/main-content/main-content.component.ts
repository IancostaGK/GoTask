import { Component } from '@angular/core';
import { WelcomeCardComponent } from "../welcome-card/welcome-card.component";
import { TodoListContainerComponent } from "../todo-list-container/todo-list-container.component";

@Component({
  selector: 'app-main-content',
  imports: [WelcomeCardComponent, TodoListContainerComponent],
  templateUrl: './main-content.component.html',
})
export class MainContentComponent {

}
