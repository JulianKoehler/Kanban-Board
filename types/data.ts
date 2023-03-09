export type KanbanData = IBoard[];

export interface IBoard {
  id: string;
  name: string;
  columns?: IColumn[];
}

export interface IColumn {
  id: string;
  index: number;
  name: string;
  tasks?: ITask[];
}

export interface ITask {
  id: string;
  title: string;
  details: string;
  status: string;
  subtasks: Subtask[];
}

export interface Subtask {
  id: string;
  title: string;
  isCompleted: boolean;
}
