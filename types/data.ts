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
  markedForDeletion: boolean;
  name: string;
  boardId: string;
  tasks?: ITask[];
}

export interface ITask {
  id: string;
  column: string;
  index: number;
  title: string;
  details: string;
  status: IStatus;
  subtasks: ISubtask[];
}

export interface ISubtask {
  id: string;
  index: number;
  title: string;
  isCompleted: boolean;
  markedForDeletion: boolean;
}

export interface BoardListItem {
  id: string;
  name: string;
  index: number;
}

export interface IStatus {
  name: string;
  columnID: string;
}
