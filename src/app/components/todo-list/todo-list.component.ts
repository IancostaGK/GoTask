import { Component, computed, input } from '@angular/core';
import { TaskStatus } from '../../types/Task';
import { TextComponent } from "../text/text.component";
import { TaskComponent } from "../task/task.component";

const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'To Do',
  inProgress: 'In Progress',
  done: 'Done',
};

@Component({
  selector: 'app-todo-list',
  imports: [TextComponent, TaskComponent],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css',
})
export class TodoListComponent {
  readonly status = input.required<TaskStatus>();
  readonly statusLabel = computed(() => STATUS_LABELS[this.status()]);
}
