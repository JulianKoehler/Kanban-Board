export type KanbanData = IBoard[];

export interface IBoard {
  id: number | string;
  name: string;
  columns: IColumn[];
}

export interface IColumn {
  id: number | string;
  name: string;
  tasks: ITask[];
}

export interface ITask {
  id: number | string;
  title: string;
  details: string;
  status: string;
  subtasks: Subtask[];
}

export interface Subtask {
  id: number | string;
  title: string;
  isCompleted: boolean;
}
