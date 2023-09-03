export type KanbanData = IBoard[];

export interface IBoard {
  id: string;
  name: string;
  columns?: IColumn[];
  index: number;
  users: {
    creator: string;
    contributors?: string[];
  };
}

export interface IColumn {
  id: string;
  index: number;
  markedForDeletion: boolean;
  name: string;
  color: string;
  boardId: string;
  tasks?: ITask[];
}

export interface ITask {
  id: string;
  column: string;
  timestamp: number;
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

export interface IStatus {
  name: string;
  columnID: string;
}

export interface BoardListItem {
  id: string;
  name: string;
  index: number;
  userId: string;
}
