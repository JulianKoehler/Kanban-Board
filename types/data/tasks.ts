interface TaskBase {
  title: string;
  description: string;
}

interface TaskMutation extends TaskBase {
  boardId: string;
  stageId: string;
}

interface TaskCreate extends TaskMutation {
  subtasks: SubtaskCreate[];
}

interface TaskUpdate extends TaskMutation {
  subtasks: SubtaskUpdate[];
  prevStageId?: string;
}

interface TaskStageUpdate {
  boardId: string;
  taskId: string;
  prevStageId: string;
  newStageId: string;
}

interface TaskResponse extends TaskBase {
  id: string;
  status: Status;
  subtasks: SubtaskResponse[];
}

interface TaskDeleteResponse {
  board_id: string;
  stage_id: string;
}
