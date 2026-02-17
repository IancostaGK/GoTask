import { Component } from '@angular/core';
import { WelcomeCardComponent } from "../../../components/welcome-card/welcome-card.component";
import { TodoListComponent } from "../../../components/todo-list/todo-list.component";

@Component({
  selector: 'app-main-content',
  imports: [WelcomeCardComponent, TodoListComponent],
  templateUrl: './main-content.component.html',
})
export class MainContentComponent {

}
