export type KanbanData = IBoard[];

export interface IBoard {
  id: string;
  name: string;
  columns?: IColumn[];
  index: number;
}

export interface IColumn {
  id: string;
  index: number;
  name: string;
  boardId: string;
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

export interface BoardListItem {
  id: string;
  name: string;
  index: number;
  columns?: IColumn[];
}
