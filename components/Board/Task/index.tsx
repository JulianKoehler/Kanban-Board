import { IBoard, ITask, ISubtask, IColumn } from "@/types/data";
import Image from "next/image";
import OptionsIcon from "@/public/assets/icon-vertical-ellipsis.svg";
import { useEffect, useRef, useState } from "react";
import GenericModalContainer from "@/components/UI/Modal/GenericModalContainer";
import Subtask from "../Subtask";
import DropDownContainer from "../../UI/DropDown/DropDownContainer";
import DropDown from "../../UI/InputFields/DropDown";
import useMenuHandler from "@/hooks/useMenuHandler";
import AddOrEditTaskModal from "./AddOrEditTaskModal";
import DeletionWarning from "@/components/UI/Modal/DeletionWarning";
import useHttpRequest from "@/hooks/useHttpRequest";
import API_URLS from "@/util/API_URLs";
import { useAppDispatch } from "@/redux/hooks";
import { deleteTask, updateExistingTask } from "@/redux/slices/boardSlice";

type Props = {
  currentBoard: IBoard;
  task: ITask;
};

const Task = ({ currentBoard, task }: Props) => {
  const dispatch = useAppDispatch();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [showDeletionWarning, setShowDeletionWarning] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { showElement: showEditTaskMenu, setShowElement: setShowEditTaskMenu } =
    useMenuHandler(menuRef);
  const { isLoading, hasError, deleteData, sendData } = useHttpRequest();
  const [subtasks, setSubtasks] = useState(task.subtasks);
  const completedTasks = subtasks.reduce((completedTasks, subtask) => {
    if (subtask.isCompleted && !subtask.markedForDeletion) {
      return completedTasks + 1;
    }
    return completedTasks;
  }, 0);

  function handleEditCurrentBoard() {
    setShowEditTaskModal(true);
    setShowTaskModal(false);
  }

  async function handleDeleteCurrentTask() {
    await deleteData(API_URLS.deleteTask, { id: task.id });

    if (hasError) {
      throw new Error("Could not delete Task, please try again later.");
    }

    dispatch(deleteTask(task));
    setShowDeletionWarning(false);
  }

  function onSubtaskChange(updatedSubtask: ISubtask, index: number) {
    setSubtasks((prevSubtasks) => {
      const subtasks = [...prevSubtasks];
      subtasks[index] = updatedSubtask;

      return subtasks;
    });
  }

  async function handleStatusChange(newStatus: IColumn) {
    const updatedTaskData = {
      ...task,
      subtasks,
      column: newStatus.id,
      status: {
        name: newStatus.name,
        columnID: newStatus.id,
      },
    };
    // Send the PATCH Request to the server
    await sendData("PATCH", API_URLS.addOrEditTask, updatedTaskData);
    console.log(updatedTaskData);

    // Update the UI

    if (!isLoading && hasError) {
      // For now I am generating an alert, want to replace it with Push Notes soon
      window.alert("Could not change the status! Check the console.");
    }

    if (!isLoading && !hasError) {
      dispatch(
        updateExistingTask({
          ...updatedTaskData,
          oldColumnId: task.column,
        })
      );
    }
  }

  useEffect(() => {
    setSubtasks(task.subtasks);
  }, [task.subtasks]);

  return (
    <>
      <div
        onClick={() => setShowTaskModal(true)}
        className="group flex max-w-[28rem] cursor-pointer flex-col gap-[0.8rem] rounded-xl bg-white py-[2.3rem] px-[1.6rem] shadow-md hover:z-30 dark:bg-grey-dark dark:shadow-md-dark"
      >
        <h3 className="text-lg font-bold group-hover:text-purple-main ">
          {task.title}
        </h3>
        <p className="text-sm font-bold text-grey-medium">
          {completedTasks} of {task?.subtasks?.length} subtasks completed
        </p>
      </div>
      {!showDeletionWarning && showTaskModal && (
        <GenericModalContainer
          additionalClassNames="w-[48rem] gap-[2.4rem]"
          onClose={() => setShowTaskModal(false)}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">{task.title}</h2>
            <button
              onClick={() => setShowEditTaskMenu((prevState) => !prevState)}
              className="relative h-fit w-12 px-[1rem]"
            >
              <Image src={OptionsIcon} alt="options" />
              {showEditTaskMenu && (
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
                    onClick={() => setShowDeletionWarning(true)}
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
              Subtasks ({completedTasks} of {task?.subtasks?.length})
            </h4>
            {subtasks.map((subtask, index) => (
              <Subtask
                key={subtask.id}
                id={subtask.id}
                index={index}
                checked={subtask.isCompleted}
                title={subtask.title}
                taskId={task.id}
                markedForDeletion={subtask.markedForDeletion}
                updateSubtask={(updatedSubtask) =>
                  onSubtaskChange(updatedSubtask, index)
                }
              />
            ))}
          </div>
          <div className="flex flex-col gap-[1.6rem]">
            <h4 className="text-sm font-bold text-grey-medium">
              Current Status
            </h4>
            <DropDown
              task={task}
              dropDownOptions={currentBoard.columns!}
              onStatusChange={(selectedColumn) =>
                handleStatusChange(selectedColumn)
              }
            />
          </div>
        </GenericModalContainer>
      )}
      {showEditTaskModal && (
        <AddOrEditTaskModal
          task={task}
          statusOptions={currentBoard.columns!}
          subtaskList={subtasks}
          onClose={() => setShowEditTaskModal(false)}
        />
      )}
      {showDeletionWarning && (
        <DeletionWarning
          type="task"
          title={task.title}
          onClose={() => setShowDeletionWarning(false)}
          deleteFunction={handleDeleteCurrentTask}
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export default Task;
