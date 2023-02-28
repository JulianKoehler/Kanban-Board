import { IBoard, ITask, KanbanData } from "@/types/data";
import Image from "next/image";
import OptionsIcon from "@/public/assets/icon-vertical-ellipsis.svg";
import { useRef, useState } from "react";
import GenericModalContainer from "@/components/UI/Modal/GenericModalContainer";
import Subtask from "../Subtask";
import DropDownContainer from "../../UI/Modal/DropDownContainer";
import DropDown from "./DropDown";
import useMenuHandler from "@/hooks/useMenuHandler";

type Props = {
  data: IBoard;
  task: ITask;
  index: number;
};

const Task = ({ data, task, index }: Props) => {
  const [showTask, setShowTask] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const {
    showElement: showEditTaskModal,
    setShowElement: setShowEditTaskModal,
  } = useMenuHandler(menuRef);

  const completedTasks = task.subtasks.reduce((completedTasks, task) => {
    if (task.isCompleted) {
      return completedTasks + 1;
    }
    return completedTasks;
  }, 0);

  function handleEditCurrentBoard() {
    // open Edit Modal
  }

  function handleDeleteCurrentBoard() {
    // open Delete Modal
  }

  return (
    <>
      <div
        onClick={() => setShowTask(true)}
        className="group flex max-w-[28rem] cursor-pointer flex-col gap-[0.8rem] rounded-xl bg-white py-[2.3rem] px-[1.6rem] shadow-md hover:z-30 dark:bg-grey-dark dark:shadow-md-dark"
      >
        <h3 className="text-lg font-bold group-hover:text-purple-main ">
          {task.title}
        </h3>
        <p className="text-sm font-bold text-grey-medium">
          {completedTasks} of {task.subtasks.length} subtasks completed
        </p>
      </div>
      {showTask && (
        <GenericModalContainer
          additionalClassNames="w-[48rem] gap-[2.4rem]"
          onClose={() => setShowTask(false)}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">{task.title}</h2>
            <button
              onClick={() => setShowEditTaskModal((prevState) => !prevState)}
              className="relative h-fit w-12 px-[1rem]"
            >
              <Image src={OptionsIcon} alt="options" />
              {showEditTaskModal && (
                <DropDownContainer
                  ref={menuRef}
                  additionalClassNames="absolute right-1/2 translate-x-1/2 top-16"
                >
                  <button
                    onClick={handleEditCurrentBoard}
                    className="w-full rounded-t-xl px-[1.6rem] pt-[1.6rem] pb-[0.8rem] text-left text-base font-medium text-grey-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Edit Task
                  </button>
                  <button
                    onClick={handleDeleteCurrentBoard}
                    className="rounded-b-xl px-[1.6rem] pt-[0.8rem] pb-[1.6rem] text-left text-base font-medium text-red hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Delete Task
                  </button>
                </DropDownContainer>
              )}
            </button>
          </div>
          <p className="text-base font-medium text-grey-medium">
            {task.details || "No further details available"}
          </p>
          <div className="flex flex-col gap-[0.8rem]">
            <h4 className="mb-[0.8rem] text-sm font-bold text-grey-medium">
              Subtasks ({completedTasks} of {task.subtasks.length})
            </h4>
            {task.subtasks.map((subtask) => (
              <Subtask
                checked={subtask.isCompleted}
                title={subtask.title}
                id={subtask.title}
              />
            ))}
          </div>
          <DropDown task={task} columns={data.columns} />
        </GenericModalContainer>
      )}
    </>
  );
};

export default Task;
