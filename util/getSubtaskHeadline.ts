
export default function getSubtaskHeadline(subtasks: SubtaskResponse[]) {
  const completedTasks = getCompletedTasks(subtasks);
  return subtasks.length
    ? `Subtasks (${completedTasks} of ${subtasks.length})`
    : "This task has no subtasks";
}

function getCompletedTasks(subtasks: SubtaskResponse[]) {
  return subtasks.reduce((completedTasks, subtask) => {
    // @ts-ignore
    if (subtask.is_completed && !subtask?.markedForDeletion) {
      return completedTasks + 1;
    }
    return completedTasks;
  }, 0);
}
