import { Component } from '@angular/core';
import { TodoListComponent } from "../todo-list/todo-list.component";
import { TASK_STATUS_LIST } from "../../constants/taskStatusList";
@Component({
  selector: 'app-todo-list-container',
  imports: [TodoListComponent],
  templateUrl: './todo-list-container.component.html',
  styleUrl: './todo-list-container.component.css'
})
export class TodoListContainerComponent {
  readonly statusList = TASK_STATUS_LIST;
}
