import { useState, useEffect } from "react";
import uuid from "react-uuid";
import toast from "react-hot-toast";
import {
  IColumn,
  IStatus,
  ISubtask,
  ITaskChanged,
} from "@/types/data/board.model";
import GenericModalContainer from "@/components/UI/Modal/GenericModalContainer";
import Input from "@/components/UI/InputFields/TextInput";
import Button from "@/components/UI/Button";
import DropDown from "@/components/UI/DropDown/DropDown";
import H5 from "@/components/UI/Headings/H5";
import Form from "@/components/UI/Formelements/Form";
import FormGroup from "@/components/UI/Formelements/FormGroup";
import checkFormValidity from "@/util/checkFormValidity";
import { LoadingSpinner_TailSpin as TailSpin } from "@/components/UI/LoadingSpinner";
import { TaskModalProps } from "@/types/component-props/taskModal.model";
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from "@/redux/slices/apiSlice";
import SubtaskInputArea from "../Subtask/SubtaskInputArea";
import { useAppSelector } from "@/redux/hooks";
import { selectActiveBoard } from "@/redux/slices/boardSlice";

const TaskModal = ({
  onClose,
  showModal,
  statusOptions,
  task = undefined,
  subtaskList = undefined,
}: TaskModalProps) => {
  const [createTask, createResult] = useCreateTaskMutation();
  const [updateTask, updateResult] = useUpdateTaskMutation();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const activeBoard = useAppSelector(selectActiveBoard);

  const isEditing = task ? true : false;
  const currentColumnId = task?.column ?? statusOptions?.[0]?.id;
  const taskID = task?.id ?? uuid();
  let timestamp = task?.timestamp ?? new Date().getTime();
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.details ?? "");
  const [subtasks, setSubtasks] = useState<ISubtask[]>(
    isEditing
      ? (subtaskList as ISubtask[])
      : [
          {
            id: uuid(),
            index: 0,
            title: "",
            isCompleted: false,
            markedForDeletion: false,
          },
        ]
  );
  const [status, setStatus] = useState<IStatus>({
    name: task?.status?.name ?? statusOptions?.[0]?.name ?? "",
    columnID: task?.status?.columnID ?? statusOptions?.[0]?.id ?? "",
  });

  function handleStatusChange(selectedColumn: IColumn) {
    setStatus({
      name: selectedColumn.name,
      columnID: selectedColumn.id,
    });
  }

  function onChangeTitle(e: React.ChangeEvent<HTMLInputElement>) {
    if (
      title.length > 100 &&
      // @ts-ignore
      e.nativeEvent.inputType !== "deleteContentBackward"
    ) {
      toast("Consider putting the details into the description", {
        icon: "🚫",
        id: taskID,
      });
      return;
    }
    setTitle(e.target.value);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsFormSubmitted(true);

    const toBeValidated = [title, status.name];
    subtasks.forEach((subtask) => {
      if (!subtask.markedForDeletion) {
        toBeValidated.push(subtask.title);
      }
    });
    const isFormValid = checkFormValidity(toBeValidated);
    if (!isFormValid) return;

    if (isEditing && currentColumnId !== status.columnID) {
      timestamp = new Date().getTime();
    }

    const newTaskData: ITaskChanged = {
      id: taskID,
      timestamp,
      column: status.columnID,
      title,
      details: description,
      status,
      subtasks,
      oldColumn: currentColumnId,
      boardId: activeBoard?.id,
    };

    if (isEditing) {
      const response = updateTask(newTaskData).unwrap();
      toast.promise(response, {
        loading: "Updating your task...",
        success: "Your task has been updated.",
        error: () => `Your task could not be updated: ${updateResult.error}`,
      });
    } else {
      const response = createTask(newTaskData).unwrap();
      toast.promise(response, {
        loading: "Creating your task...",
        success: "Your task has been created.",
        error: () => `Your task could not be created: ${createResult.error}`,
      });
    }
  }

  function resetForm() {
    if (isEditing) {
      setSubtasks(task!.subtasks);
      setTitle(task!.title);
      setDescription(task!.details);
    } else {
      setSubtasks([]);
      setTitle("");
      setDescription("");
    }
    setIsFormSubmitted(false);
  }

  useEffect(() => {
    (createResult.isSuccess || updateResult.isSuccess) && onClose();
  }, [createResult.isSuccess, updateResult.isSuccess]);

  useEffect(() => {
    !showModal && resetForm();
  }, [showModal]);

  return (
    <GenericModalContainer
      isShowing={showModal}
      additionalClassNames="w-[48rem] max-h-[71rem]"
    >
      <Form onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold">
          {task ? "Edit Task" : "Add New Task"}
        </h2>
        <FormGroup>
          <H5>Title</H5>
          <Input
            className={isFormSubmitted && title.length < 1 ? "input-error" : ""}
            value={title}
            onChange={onChangeTitle}
            placeholder="e.g. Take coffee break"
          />
          {isFormSubmitted && title.length < 1 && (
            <p className="absolute bottom-[0.9rem] right-[1.6rem] text-base font-medium text-red">
              Can't be empty
            </p>
          )}
        </FormGroup>
        <FormGroup>
          <H5>Description</H5>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-[11.2rem] w-full resize-none rounded-[0.4rem] border-[0.1rem] border-[#828fa340] bg-white px-[1.6rem] py-[0.9rem] text-base invalid:border-red focus:border-purple-main focus:outline-none dark:bg-grey-dark"
            placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little."
          />
        </FormGroup>
        <FormGroup>
          <H5>Subtasks</H5>
          <div className="max-w- flex flex-col gap-[1.2rem] overflow-y-auto">
            <SubtaskInputArea
              subtasks={subtasks}
              setSubtasks={setSubtasks}
              isFormSubmitted={isFormSubmitted}
            />
          </div>
        </FormGroup>
        <FormGroup>
          <H5>Status</H5>
          <DropDown
            onStatusChange={(selectedColumn) =>
              handleStatusChange(selectedColumn)
            }
            dropDownOptions={statusOptions}
            currentOption={task?.status?.name}
          />
        </FormGroup>
        <div className="flex gap-4">
          <Button
            type="submit"
            variant="primary"
            className="flex justify-center"
          >
            {/* {isLoading ? TailSpin : isEditing ? "Save Changes" : "Create Task"} */}
            {!isEditing && (createResult.isLoading ? TailSpin : "Create Task")}
            {isEditing && (updateResult.isLoading ? TailSpin : "Update Task")}
          </Button>
          <Button onClick={onClose} type="button" variant="secondary">
            {isEditing ? "Discard Changes" : "Cancel"}
          </Button>
        </div>
      </Form>
    </GenericModalContainer>
  );
};

export default TaskModal;
