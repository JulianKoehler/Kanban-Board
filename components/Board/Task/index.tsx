import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { ISubtask, IColumn } from "@/types/data/board.model";
import Image from "next/image";
import OptionsIcon from "@/public/assets/icon-vertical-ellipsis.svg";
import { useEffect, useRef, useState } from "react";
import GenericModalContainer from "@/components/UI/Modal/GenericModalContainer";
import Subtask from "../Subtask";
import DropDownContainer from "../../UI/DropDown/DropDownContainer";
import DropDown from "../../UI/DropDown/DropDown";
import useMenuHandler from "@/hooks/useMenuHandler";
import TaskModal from "./TaskModal";
import DeletionWarning from "@/components/UI/Modal/DeletionWarning";
import {
  useDeleteTaskMutation,
  useUpdateTaskMutation,
} from "@/redux/slices/apiSlice";
import { TaskProps } from "@/types/component-props/TaskProps.model";
import { useAppSelector } from "@/redux/hooks";
import { selectActiveBoard } from "@/redux/slices/boardSlice";
import getSubtaskHeadline from "@/util/getSubtaskHeadline";
import MenuButton from "@/components/UI/Button/MenuButton";

const Task = ({ currentBoard, task }: TaskProps) => {
  const [deleteTask, deleteResult] = useDeleteTaskMutation();
  const [updateTask, { error: taskUpdatingError, isLoading: isUpdatingTask }] =
    useUpdateTaskMutation();
  const [subtasks, setSubtasks] = useState(task.subtasks);
  const activeBoard = useAppSelector(selectActiveBoard);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [showDeletionWarning, setShowDeletionWarning] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { showElement: showEditTaskMenu, setShowElement: setShowEditTaskMenu } =
    useMenuHandler(menuRef);

  const taskDescription = task.details.replace(/\n/g, "<br>");
  const subtaskHeadline = getSubtaskHeadline(subtasks);
  let taskTimestamp = task.timestamp;

  function handleEditCurrentBoard() {
    setShowEditTaskModal(true);
    setShowTaskModal(false);
  }

  async function handleDeleteCurrentTask() {
    const payload = { id: task.id, boardId: currentBoard.id, column: task.column }
    const response = deleteTask(payload);

    toast.promise(response, {
      loading: "Sending...",
      success: `Your task has been deleted`,
      error: () => `Could not delete your task: ${deleteResult.error}`,
    });

    await response;
    setShowDeletionWarning(false);
  }

  function onSubtaskCheck(updatedSubtask: ISubtask, index: number) {
    setSubtasks((prevSubtasks) => {
      const subtasks = [...prevSubtasks];
      subtasks[index] = updatedSubtask;

      return subtasks;
    });
  }

  async function handleStatusChange(newStatus: IColumn) {
    taskTimestamp = new Date().getTime();
    const updatedTaskData = {
      ...task,
      timestamp: taskTimestamp,
      subtasks,
      column: newStatus.id,
      status: {
        name: newStatus.name,
        columnID: newStatus.id,
      },
      oldColumn: task.column,
      boardId: activeBoard?.id,
      isCardUI: true,
    };

    await updateTask(updatedTaskData);

    if (!isUpdatingTask && taskUpdatingError) {
      toast.error("Could not update the task status.");
    }
  }

  useEffect(() => {
    if (deleteResult.isSuccess) {
      setShowTaskModal(false);
    }
  }, [deleteResult.isSuccess]);

  useEffect(() => {
    setSubtasks(task.subtasks);
  }, [task.subtasks]);

  return (
    <>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          duration: 0.3,
          delay: 0.25,
        }}
        onClick={() => setShowTaskModal(true)}
        className="group flex max-w-[28rem] cursor-pointer flex-col gap-[0.8rem] rounded-xl bg-white py-[2.3rem] px-[1.6rem] shadow-md hover:z-30 dark:bg-grey-dark dark:shadow-md-dark"
      >
        <h3 className="text-lg font-bold group-hover:text-purple-main ">
          {task.title}
        </h3>
        <p className="text-sm font-bold text-grey-medium">{subtaskHeadline}</p>
      </motion.div>
      <GenericModalContainer
        isShowing={!showDeletionWarning && showTaskModal}
        additionalClassNames="w-[48rem] gap-[2.4rem]"
        onClose={() => setShowTaskModal(false)}
      >
        <div className="flex items-center justify-between relative">
          <h2 className="text-xl font-bold">{task.title}</h2>
          <MenuButton
            onClick={() => setShowEditTaskMenu((prevState) => !prevState)}
          >
            <Image src={OptionsIcon} alt="options" />
          </MenuButton>
          <DropDownContainer
            show={showEditTaskMenu}
            ref={menuRef}
            additionalClassNames="absolute translate-x-[120%] top-12"
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
        </div>
        <p
          className="text-base font-medium text-grey-medium translate-x-"
          dangerouslySetInnerHTML={{
            __html: taskDescription || "No further details available",
          }}
        ></p>
        <div className="flex flex-col gap-[0.8rem]">
          <h4 className="mb-[0.8rem] text-sm font-bold text-grey-medium">
            {subtaskHeadline}
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
                onSubtaskCheck(updatedSubtask, index)
              }
            />
          ))}
        </div>
        <div className="flex flex-col gap-[1.6rem]">
          <h4 className="text-sm font-bold text-grey-medium">Current Status</h4>
          <DropDown
            currentOption={task?.status?.name}
            dropDownOptions={currentBoard.columns!}
            onStatusChange={(selectedColumn) =>
              handleStatusChange(selectedColumn)
            }
          />
        </div>
      </GenericModalContainer>
      <TaskModal
        key={task.id}
        task={task}
        statusOptions={currentBoard.columns!}
        subtaskList={subtasks}
        showModal={showEditTaskModal}
        onClose={() => setShowEditTaskModal(false)}
      />

      <DeletionWarning
        showDeletionWarning={showDeletionWarning}
        type="task"
        title={task.title}
        onClose={() => setShowDeletionWarning(false)}
        deleteFunction={handleDeleteCurrentTask}
        isLoading={deleteResult.isLoading}
      />
    </>
  );
};

export default Task;
