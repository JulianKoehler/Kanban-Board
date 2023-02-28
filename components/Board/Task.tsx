import { ITask } from "@/types/data";
import React from "react";

type Props = {
  task: ITask;
  index: number;
};

const Task = ({ task, index }: Props) => {
  const completedTasks = task.subtasks.reduce((completedTasks, task) => {
    if (task.isCompleted) {
      return completedTasks + 1;
    }
    return 0;
  }, 0);

  return (
    <div className="group flex max-w-[28rem] cursor-pointer flex-col gap-[0.8rem] rounded-xl bg-white py-[2.3rem] px-[1.6rem] shadow-md hover:z-30 dark:bg-grey-dark dark:shadow-md-dark">
      <h3 className="text-lg font-bold group-hover:text-purple-main ">
        {task.title}
      </h3>
      <p className="text-sm font-bold text-grey-medium">
        {completedTasks} of {task.subtasks.length} subtasks completed
      </p>
    </div>
  );
};

export default Task;
