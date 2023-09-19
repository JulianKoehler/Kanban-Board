import React, { useEffect, useState } from "react";
import { SubtaskProps } from "@/types/component-props/Subtask.model";
import { useMarkSubtaskMutation } from "@/redux/slices/apiSlice";
import { toast } from "react-hot-toast";
import { useAppSelector } from "@/redux/hooks";
import { selectActiveBoard } from "@/redux/slices/boardSlice";
import { motion } from "framer-motion";


const Subtask = ({
  checked,
  id,
  markedForDeletion,
  index,
  title,
  taskId,
  updateSubtask,
}: SubtaskProps) => {
  const [isCompleted, setIsCompleted] = useState(checked);
  const [toggleSubtask, result] = useMarkSubtaskMutation();
  const activeBoard = useAppSelector(selectActiveBoard)

  function handleCheck() {
    setIsCompleted((completed) => !completed);
    /**
     *We have to provide the opposite of the current state since we will not have the latest update
     immediately after setIsCompleted changed state. Say the user clicks one subtask, so the
     upper function will set isCompleted from false to true. But at the time we pass isCompleted to
     the function below isCompleted will still be false. If we pass the opposite of this we are passing
     the correct boolean value. I also tried it with useEffect but we get strange results with it.
     */
    updateSubtask({
      id,
      index,
      title,
      markedForDeletion,
      isCompleted: !isCompleted,
    });

    toggleSubtask({
      taskId,
      subtaskId: id,
      isCompleted: !isCompleted,
      boardId: activeBoard!.id
    });
  }

  useEffect(() => {
    if (result.isError) toast.error("Could not update Subtask");
  }, [result.isError]);

  return (
    <div
      className={`flex cursor-pointer items-center rounded-md bg-grey-light focus:border-[0.1rem] focus:border-[purple-main] dark:bg-grey-dark ${
        !isCompleted && "hover:bg-[#635fc740] dark:hover:bg-[#635fc740]"
      }`}
    >
      <motion.input
        id={id}
        className="absolute cursor-pointer opacity-0"
        checked={isCompleted}
        onChange={handleCheck}
        type="checkbox"
      />
      <label
        className={`flex w-[41.6rem] before:transition-all before:duration-300 transition-all duration-300 cursor-pointer items-center p-[1.2rem] text-sm font-bold ${
          isCompleted
            ? "text-grey-medium line-through decoration-lines-light decoration-[0.1rem] before:bg-purple-main before:bg-checkIcon before:bg-center before:bg-no-repeat dark:decoration-lines-dark dark:before:bg-purple-main"
            : ""
        } before:mr-[1.6rem] before:h-[1.6rem] before:min-w-[1.6rem] before:rounded before:border-[0.1rem] before:border-[#828fa333]  before:content-['']  ${
          !isCompleted && "before:bg-white before:dark:bg-grey-dark"
        }`}
        htmlFor={id}
      >
        {title}
      </label>
    </div>
  );
};

export default Subtask;
