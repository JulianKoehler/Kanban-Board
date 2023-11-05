export type KanbanData = IBoard[];

export interface IBoard {
  id: string;
  name: string;
  columns?: IColumn[];
  index: number;
  users: {
    creator: string | undefined;
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

export type ITaskChanged = ITask & {
  oldColumn: string;
  boardId: string | undefined;
  isCardUI?: boolean;
}

export type TaskDataServerResponse = {
  message: string;
  data: Pick<ITaskChanged, "id" | "column" | "oldColumn" | "boardId">
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
