import { IColumn, IStatus, ISubtask, ITask } from "@/types/data";
import { useState } from "react";
import GenericModalContainer from "@/components/UI/Modal/GenericModalContainer";
import TextInput from "@/components/UI/InputFields/TextInput";
import DeleteIcon from "@/components/UI/Icons/DeleteIcon";
import Button from "@/components/UI/Button";
import DropDown from "@/components/UI/InputFields/DropDown";
import { LoadingSpinner_TailSpin as TailSpin } from "@/components/UI/LoadingSpinner";
import uuid from "react-uuid";
import checkFormValidity from "@/util/checkFormValidity";
import H5 from "@/components/UI/Headings/H5";
import Form from "@/components/UI/Formelements/Form";
import FormGroup from "@/components/UI/Formelements/FormGroup";
import { useAppDispatch } from "@/redux/hooks";
import { addNewTask, updateExistingTask } from "@/redux/slices/boardSlice";
import useHttpRequest from "@/hooks/useHttpRequest";
import API_URLS from "@/util/API_URLs";

type Props = {
  statusOptions: IColumn[];
  task?: ITask;
  onClose: VoidFunction;
  subtaskList?: ISubtask[];
};

const AddOrEditTaskModal = ({
  onClose,
  statusOptions,
  task = undefined,
  subtaskList = undefined,
}: Props) => {
  const dispatch = useAppDispatch();
  const isEditing = task ? true : false;
  const currentColumnId = task?.column ?? statusOptions[0].id;
  const { isLoading, hasError, sendData } = useHttpRequest();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
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
  const [status, setStatus] = useState<IStatus>(
    task
      ? {
          name: task.status.name,
          columnID: task.status.columnID,
        }
      : {
          name: statusOptions[0].name,
          columnID: statusOptions[0].id,
        }
  );

  console.log(description);

  const subtaskInputFields = subtasks.map((subtask, index) => {
    return subtask.markedForDeletion ? null : (
      <div key={subtask.id} className="relative flex gap-[1.6rem]">
        <TextInput
          value={subtask.title}
          additionalClasses={
            isFormSubmitted && subtask.title.length < 1 ? "input-error" : ""
          }
          onChange={(e) => handleSubtaskInput(e, index)}
          placeholder="e.g. Make coffee"
        />
        <button
          type="button"
          onClick={() => onDeleteSubtaskInput(index)}
          className="aspect-square w-[1.485rem] fill-grey-medium transition-colors duration-200 hover:fill-red"
        >
          <DeleteIcon />
        </button>
        {subtask.title.length < 1 && isFormSubmitted && (
          <p className="absolute bottom-[0.9rem] right-[4.6rem] text-base font-medium text-red">
            Can't be empty
          </p>
        )}
      </div>
    );
  });

  function handleSubtaskInput(
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) {
    setSubtasks((prevSubtasks) => {
      const subtasks = [...prevSubtasks!];

      subtasks[index] = {
        ...subtasks[index],
        title: e.target.value,
      };

      return subtasks;
    });
  }

  function onDeleteSubtaskInput(index: number) {
    if (subtasks.length <= 1) return; // There should always be at least 1 input field visible
    setSubtasks((prevSubtasks) => {
      const subtasks = [...prevSubtasks!];

      subtasks[index] = {
        ...subtasks[index],
        markedForDeletion: true,
      };

      return subtasks;
    });
  }

  function onAddNewSubtaskInput() {
    setSubtasks((prevSubtasks) => [
      ...prevSubtasks!,
      {
        id: uuid(),
        index: subtasks.length,
        title: "",
        isCompleted: false,
        markedForDeletion: false,
      },
    ]);
  }

  function handleStatusChange(selectedColumn: IColumn) {
    setStatus({
      name: selectedColumn.name,
      columnID: selectedColumn.id,
    });
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

    if (!isFormValid) {
      return;
    }

    if (isEditing && currentColumnId !== status.columnID) {
      timestamp = new Date().getTime();
    }

    const newTaskData: ITask = {
      id: taskID,
      timestamp: timestamp,
      column: status.columnID,
      title,
      details: description,
      status: status,
      subtasks,
    };

    await sendData(
      isEditing ? "PATCH" : "POST",
      API_URLS.addOrEditTask,
      newTaskData
    );

    if (hasError) {
      return;
    }

    const subtasksNotMarkedForDeletion = subtasks.filter(
      (subtask) => !subtask.markedForDeletion
    );

    isEditing
      ? dispatch(
          updateExistingTask({
            ...newTaskData,
            subtasks: subtasksNotMarkedForDeletion,
            oldColumnId: currentColumnId!,
          })
        )
      : dispatch(
          addNewTask({
            ...newTaskData,
            subtasks: subtasksNotMarkedForDeletion,
          })
        );

    onClose();
  }

  return (
    <GenericModalContainer
      onClose={onClose}
      additionalClassNames="w-[48rem] max-h-[71rem]"
    >
      <Form onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold">
          {task ? "Edit Task" : "Add New Task"}
        </h2>
        <FormGroup>
          <H5>Title</H5>
          <TextInput
            additionalClasses={
              isFormSubmitted && title.length < 1 ? "input-error" : ""
            }
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
        <FormGroup className="flex flex-col gap-[1.6rem]">
          <H5>Subtasks</H5>
          <div className="flex max-h-[9.6rem] flex-col gap-[1.2rem] overflow-y-auto">
            {subtaskInputFields}
          </div>
          <Button
            variant="secondary"
            type="button"
            onClick={onAddNewSubtaskInput}
          >
            + Add New Subtask
          </Button>
        </FormGroup>
        <FormGroup className="flex flex-col gap-[0.8rem]">
          <H5>Status</H5>
          <DropDown
            onStatusChange={(selectedColumn) =>
              handleStatusChange(selectedColumn)
            }
            dropDownOptions={statusOptions}
            task={task}
          />
        </FormGroup>
        <Button
          type="submit"
          variant="primary"
          additionalClassNames="flex justify-center"
        >
          {isLoading ? TailSpin : isEditing ? "Save Changes" : "Create Task"}
        </Button>
      </Form>
    </GenericModalContainer>
  );
};

export default AddOrEditTaskModal;
