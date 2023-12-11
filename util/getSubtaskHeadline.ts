import { Subtask } from "@/types/data/subtask";

export default function getSubtaskHeadline(subtasks: Subtask[]) {
  const completedTasks = getCompletedTasks(subtasks);
  return subtasks.length
    ? `Subtasks (${completedTasks} of ${subtasks.length})`
    : "This task has no subtasks";
}

function getCompletedTasks(subtasks: Subtask[]) {
  return subtasks.reduce((completedTasks, subtask) => {

    if (subtask.is_completed && !subtask?.markedForDeletion) {
      return completedTasks + 1;
    }
    return completedTasks;
  }, 0);
}
