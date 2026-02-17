import { TestBed } from '@angular/core/testing';
import { TaskManagerService } from './task-manager.service';

describe('TaskManagerService', () => {
  let service: TaskManagerService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskManagerService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with an empty board', () => {
    const board = service.tasks();
    expect(board.todo).toEqual([]);
    expect(board.inProgress).toEqual([]);
    expect(board.done).toEqual([]);
  });

  it('should return a deep clone on each signal change', () => {
    service.createTask('todo', 'Test', 'Description');
    const board1 = service.tasks();

    service.createTask('todo', 'Test 2', 'Description 2');
    const board2 = service.tasks();

    expect(board1.todo.length).toBe(1);
    expect(board2.todo.length).toBe(2);
    expect(board1).not.toBe(board2);
    expect(board1.todo[0]).not.toBe(board2.todo[0]);
  });

  describe('localStorage persistence', () => {
    it('should save board to localStorage on changes', () => {
      service.createTask('todo', 'Persisted Task', 'Desc');
      TestBed.flushEffects();

      const stored = localStorage.getItem('gotask-board');
      expect(stored).toBeTruthy();

      const parsed = JSON.parse(stored!);
      expect(parsed.todo.length).toBe(1);
      expect(parsed.todo[0].title).toBe('Persisted Task');
    });

    it('should restore board from localStorage on init', () => {
      const board = {
        todo: [{
          id: 'test-id',
          title: 'Restored Task',
          description: 'Desc',
          comments: [{ id: 'c1', comment: 'Hello', createdDate: '2026-01-01T00:00:00.000Z' }],
        }],
        inProgress: [],
        done: [],
      };
      localStorage.setItem('gotask-board', JSON.stringify(board));

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({});
      const freshService = TestBed.inject(TaskManagerService);

      const tasks = freshService.tasks();
      expect(tasks.todo.length).toBe(1);
      expect(tasks.todo[0].title).toBe('Restored Task');
      expect(tasks.todo[0].comments[0].createdDate).toBeInstanceOf(Date);
    });

    it('should handle corrupted localStorage gracefully', () => {
      localStorage.setItem('gotask-board', 'invalid-json');

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({});
      const freshService = TestBed.inject(TaskManagerService);

      const tasks = freshService.tasks();
      expect(tasks.todo).toEqual([]);
      expect(tasks.inProgress).toEqual([]);
      expect(tasks.done).toEqual([]);
    });
  });

  describe('createTask', () => {
    it('should create a task in the specified column', () => {
      service.createTask('todo', 'My Task', 'My Description');
      const board = service.tasks();
      expect(board.todo.length).toBe(1);
      expect(board.todo[0].title).toBe('My Task');
      expect(board.todo[0].description).toBe('My Description');
      expect(board.todo[0].comments).toEqual([]);
      expect(board.todo[0].id).toBeTruthy();
    });

    it('should create tasks in different columns', () => {
      service.createTask('todo', 'Task 1', 'Desc 1');
      service.createTask('inProgress', 'Task 2', 'Desc 2');
      service.createTask('done', 'Task 3', 'Desc 3');

      const board = service.tasks();
      expect(board.todo.length).toBe(1);
      expect(board.inProgress.length).toBe(1);
      expect(board.done.length).toBe(1);
    });
  });

  describe('updateTask', () => {
    it('should update the title of a task', () => {
      service.createTask('todo', 'Original', 'Desc');
      const taskId = service.tasks().todo[0].id;

      service.updateTask(taskId, { title: 'Updated' });

      expect(service.tasks().todo[0].title).toBe('Updated');
      expect(service.tasks().todo[0].description).toBe('Desc');
    });

    it('should update the description of a task', () => {
      service.createTask('todo', 'Title', 'Original');
      const taskId = service.tasks().todo[0].id;

      service.updateTask(taskId, { description: 'Updated' });

      expect(service.tasks().todo[0].description).toBe('Updated');
      expect(service.tasks().todo[0].title).toBe('Title');
    });

    it('should do nothing for a non-existent task', () => {
      service.createTask('todo', 'Title', 'Desc');
      service.updateTask('non-existent', { title: 'Updated' });
      expect(service.tasks().todo[0].title).toBe('Title');
    });
  });

  describe('changeTaskStatus', () => {
    it('should move a task from one column to another', () => {
      service.createTask('todo', 'Task', 'Desc');
      const taskId = service.tasks().todo[0].id;

      service.changeTaskStatus(taskId, 'inProgress');

      const board = service.tasks();
      expect(board.todo.length).toBe(0);
      expect(board.inProgress.length).toBe(1);
      expect(board.inProgress[0].title).toBe('Task');
    });

    it('should do nothing when moving to the same status', () => {
      service.createTask('todo', 'Task', 'Desc');
      const taskId = service.tasks().todo[0].id;

      service.changeTaskStatus(taskId, 'todo');

      expect(service.tasks().todo.length).toBe(1);
    });

    it('should do nothing for a non-existent task', () => {
      service.createTask('todo', 'Task', 'Desc');
      service.changeTaskStatus('non-existent', 'done');
      expect(service.tasks().todo.length).toBe(1);
    });
  });

  describe('deleteTask', () => {
    it('should remove a task from its column', () => {
      service.createTask('todo', 'Task', 'Desc');
      const taskId = service.tasks().todo[0].id;

      service.deleteTask(taskId);

      expect(service.tasks().todo.length).toBe(0);
    });

    it('should do nothing for a non-existent task', () => {
      service.createTask('todo', 'Task', 'Desc');
      service.deleteTask('non-existent');
      expect(service.tasks().todo.length).toBe(1);
    });
  });

  describe('addComment', () => {
    it('should add a comment to a task', () => {
      service.createTask('todo', 'Task', 'Desc');
      const taskId = service.tasks().todo[0].id;

      service.addComment(taskId, 'My comment');

      const task = service.tasks().todo[0];
      expect(task.comments.length).toBe(1);
      expect(task.comments[0].comment).toBe('My comment');
      expect(task.comments[0].createdDate).toBeInstanceOf(Date);
      expect(task.comments[0].id).toBeTruthy();
    });

    it('should add multiple comments to a task', () => {
      service.createTask('todo', 'Task', 'Desc');
      const taskId = service.tasks().todo[0].id;

      service.addComment(taskId, 'Comment 1');
      service.addComment(taskId, 'Comment 2');

      expect(service.tasks().todo[0].comments.length).toBe(2);
    });

    it('should do nothing for a non-existent task', () => {
      service.addComment('non-existent', 'Comment');
      const board = service.tasks();
      expect(board.todo.length).toBe(0);
    });
  });

  describe('removeComment', () => {
    it('should remove a comment from a task', () => {
      service.createTask('todo', 'Task', 'Desc');
      const taskId = service.tasks().todo[0].id;

      service.addComment(taskId, 'Comment');
      const commentId = service.tasks().todo[0].comments[0].id;

      service.removeComment(taskId, commentId);

      expect(service.tasks().todo[0].comments.length).toBe(0);
    });

    it('should only remove the specified comment', () => {
      service.createTask('todo', 'Task', 'Desc');
      const taskId = service.tasks().todo[0].id;

      service.addComment(taskId, 'Comment 1');
      service.addComment(taskId, 'Comment 2');
      const commentId = service.tasks().todo[0].comments[0].id;

      service.removeComment(taskId, commentId);

      const comments = service.tasks().todo[0].comments;
      expect(comments.length).toBe(1);
      expect(comments[0].comment).toBe('Comment 2');
    });

    it('should do nothing for a non-existent comment', () => {
      service.createTask('todo', 'Task', 'Desc');
      const taskId = service.tasks().todo[0].id;
      service.addComment(taskId, 'Comment');

      service.removeComment(taskId, 'non-existent');

      expect(service.tasks().todo[0].comments.length).toBe(1);
    });
  });
});
