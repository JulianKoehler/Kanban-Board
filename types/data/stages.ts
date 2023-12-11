import { TaskResponse } from "./tasks";

export interface StageBase {
  title: string;
  index: number;
  color: string;
}

export interface StageCreate extends StageBase {
  id: string;
  boardId?: string;
}

export interface StageUpdate extends StageCreate {
  markedForDeletion?: boolean;
}

export interface StageResponse extends StageBase {
  id: string;
  tasks: TaskResponse[];
}

export interface Status {
  id: string;
  title: string;
}
