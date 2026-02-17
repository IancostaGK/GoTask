import { computed, effect, Injectable, signal } from '@angular/core';
import { Task, TaskBoard, TaskColumnLocation } from '../interfaces/Task';
import { TaskStatus } from '../types/Task';
import { generateId } from '../utils/generate-id';
import { TASK_STATUS_LIST } from '../constants/taskStatusList';

const STORAGE_KEY = 'gotask-board';

function createEmptyBoard(): TaskBoard {
  return { todo: [], inProgress: [], done: [] };
}

function loadBoard(): TaskBoard {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return createEmptyBoard();

  try {
    const parsed = JSON.parse(raw) as TaskBoard;

    for (const status of TASK_STATUS_LIST) {
      for (const task of parsed[status]) {
        task.comments = task.comments.map((c) => ({
          ...c,
          createdDate: new Date(c.createdDate),
        }));
      }
    }

    return parsed;
  } catch {
    return createEmptyBoard();
  }
}

@Injectable({
  providedIn: 'root',
})
export class TaskManagerService {
  private readonly board = signal<TaskBoard>(loadBoard());

  constructor() {
    effect(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.board()));
    });
  }

  readonly tasks = computed(() => structuredClone(this.board()));

  createTask(status: TaskStatus, title: string, description: string): void {
    const task: Task = {
      id: generateId(),
      title,
      description,
      comments: [],
    };

    this.board.update((board) => ({
      ...board,
      [status]: [...board[status], task],
    }));
  }

  updateTask(taskId: string, updates: Partial<Pick<Task, 'title' | 'description'>>): void {
    const location = this.findTaskColumn(taskId);
    if (!location) return;

    const { status, index } = location;

    this.board.update((board) => {
      const column = [...board[status]];
      column[index] = { ...column[index], ...updates };
      return { ...board, [status]: column };
    });
  }

  changeTaskStatus(taskId: string, newStatus: TaskStatus): void {
    const location = this.findTaskColumn(taskId);
    if (!location) return;

    const { status: currentStatus, index } = location;
    if (currentStatus === newStatus) return;

    this.board.update((board) => {
      const sourceColumn = [...board[currentStatus]];
      const [task] = sourceColumn.splice(index, 1);
      const targetColumn = [...board[newStatus], task];
      return { ...board, [currentStatus]: sourceColumn, [newStatus]: targetColumn };
    });
  }

  deleteTask(taskId: string): void {
    const location = this.findTaskColumn(taskId);
    if (!location) return;

    const { status, index } = location;

    this.board.update((board) => {
      const column = [...board[status]];
      column.splice(index, 1);
      return { ...board, [status]: column };
    });
  }

  addComment(taskId: string, comment: string): void {
    const location = this.findTaskColumn(taskId);
    if (!location) return;

    const { status, index } = location;
    const newComment = { id: generateId(), comment, createdDate: new Date() };

    this.board.update((board) => {
      const column = [...board[status]];
      column[index] = { ...column[index], comments: [...column[index].comments, newComment] };
      return { ...board, [status]: column };
    });
  }

  removeComment(taskId: string, commentId: string): void {
    const location = this.findTaskColumn(taskId);
    if (!location) return;

    const { status, index } = location;

    this.board.update((board) => {
      const column = [...board[status]];
      column[index] = {
        ...column[index],
        comments: column[index].comments.filter((c) => c.id !== commentId),
      };
      return { ...board, [status]: column };
    });
  }

  private findTaskColumn(taskId: string): TaskColumnLocation | null {
    const board = this.board();
    const statuses: TaskStatus[] = ['todo', 'inProgress', 'done'];

    for (const status of statuses) {
      const index = board[status].findIndex((t) => t.id === taskId);
      if (index !== -1) {
        return { status, index };
      }
    }

    return null;
  }
}
