import { ISubtask } from "@/types/data/board.model";

export default function getSubtaskHeadline(subtasks: ISubtask[]) {
  const completedTasks = getCompletedTasks(subtasks);
  return subtasks.length
    ? `Subtasks (${completedTasks} of ${subtasks.length})`
    : "This task has no subtasks";
}

function getCompletedTasks(subtasks: ISubtask[]) {
  return subtasks.reduce((completedTasks, subtask) => {
    if (subtask.isCompleted && !subtask.markedForDeletion) {
      return completedTasks + 1;
    }
    return completedTasks;
  }, 0);
}
