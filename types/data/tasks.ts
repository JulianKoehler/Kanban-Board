import { Status } from "./stages";
import { Subtask } from "./subtask";
import { UserInfoReturn } from "./user";

export interface TaskBase {
  title: string;
  description: string;
}

export interface TaskMutation extends TaskBase {
  boardId: string;
  stageId: string;
  assignedUserId: string | null;
}

export interface TaskCreate extends TaskMutation {
  subtasks: Subtask[];
}

export interface TaskUpdate extends TaskMutation {
  subtasks: Subtask[];
  prevStageId?: string;
}

export interface TaskStageUpdate {
  boardId: string;
  taskId: string;
  prevStageId: string;
  newStageId: string;
}

export interface TaskUpdateAssignedUser {
  taskId: string;
  assignedUserId: string | null;
}

export interface TaskResponse extends TaskBase {
  id: string;
  status: Status;
  subtasks: Subtask[];
  assigned_user: UserInfoReturn;
}

export interface TaskDeleteResponse {
  board_id: string;
  stage_id: string;
}
