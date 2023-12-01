import { V4Options } from "uuid";

export interface IBoard {
  // id: string;
  title: string;
  stages?: IStage[];
  // index: number;
  // owner: string;
  // contributors: string[];
}

export interface IBoardCreate {
  title: string;
  stages: IStageCreate[]
}

export interface IBoardCreateResponse {
  title: string;
  id: string;
  createdAt: string;
}

export interface IBoardListItem {
  id: string;
  title: string;
  createdAt: number;
}

export interface IStage {
  id: string;
  index: number;
  markedForDeletion?: boolean;
  title: string;
  color: string;
  // boardId?: string;
  tasks?: ITask[];
}

export interface IStageCreate {
  title: string;
  index: number;
  color: string;
  boardId: string;
}

export interface ITask {
  id: string;
  stage: string;
  timestamp: number;
  title: string;
  description: string;
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
  id?: string;
  index: number;
  title: string;
  isCompleted: boolean;
  markedForDeletion?: boolean;
}

export interface IStatus {
  title: string;
  stageId: string;
}
