export type TaskStatus = 'todo' | 'inProgress' | 'done';

export interface Comment {
  id: string;
  comment: string;
  createdDate: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  comments: Comment[];
}

export type TaskBoard = Record<TaskStatus, Task[]>;
