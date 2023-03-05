import { IColumn, ITask } from "@/types/data";
import { useState } from "react";
import GenericModalContainer from "@/components/UI/Modal/GenericModalContainer";
import TextInput from "@/components/UI/InputFields/TextInput";
import DeleteIcon from "@/components/UI/Icons/DeleteIcon";
import Button from "@/components/UI/Button";
import DropDown from "@/components/UI/InputFields/DropDown";
import uuid from "react-uuid";
import checkFormValidity from "@/util/checkFormValidity";
import H5 from "@/components/UI/Headings/H5";
import Form from "@/components/UI/Formelements/Form";
import FormGroup from "@/components/UI/Formelements/FormGroup";

type Props = {
  onClose: VoidFunction;
  statusOptions: IColumn[];
  task?: ITask | null;
};

const AddOrEditTaskModal = ({ onClose, statusOptions, task = null }: Props) => {
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.details ?? "");
  const [subtasks, setSubtasks] = useState(
    task?.subtasks ?? [
      {
        id: uuid(),
        title: "",
        isCompleted: false,
      },
    ]
  );
  const [status, setStatus] = useState<string>(
    task?.status ?? statusOptions[0].name
  );

  const subtaskInputFields = subtasks.map((subtask, index) => (
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
        onClick={() => onDeleteSubtaskInput(subtask.id)}
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
  ));

  function handleSubtaskInput(
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) {
    setSubtasks((prevSubtasks) => {
      let subtasks = [...prevSubtasks];

      subtasks[index] = {
        ...subtasks[index],
        title: e.target.value,
      };

      return subtasks;
    });
  }

  function onDeleteSubtaskInput(id: string | number) {
    if (subtasks.length <= 1) return; // There should always be at least 1 input field visible
    setSubtasks((prev) => prev.filter((subtask) => subtask.id !== id));
  }

  function onAddNewSubtaskInput() {
    setSubtasks((prev) => [
      ...prev,
      {
        id: uuid(),
        title: "",
        isCompleted: false,
      },
    ]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsFormSubmitted(true);

    const toBeValidated = [title, status];
    subtasks.forEach((subtask) => {
      toBeValidated.push(subtask.title);
    });
    const isFormValid = checkFormValidity(toBeValidated);

    if (isFormValid) {
      onClose();
    }
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
            className={`h-[11.2rem] w-full resize-none rounded-[0.4rem] border-[0.1rem] border-[#828fa340] bg-white px-[1.6rem] py-[0.9rem] text-base invalid:border-red focus:border-purple-main focus:outline-none dark:bg-grey-dark ${
              isFormSubmitted && description.length < 1 ? "input-error" : ""
            }`}
            placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little."
          />
          {isFormSubmitted && description.length < 1 && (
            <p className="absolute bottom-[0.9rem] right-[1.6rem] text-base font-medium text-red">
              Can't be empty
            </p>
          )}
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
            onStatusChange={(selectedColumn) => setStatus(selectedColumn.name)}
            columns={statusOptions}
          />
        </FormGroup>
        <Button type="submit" variant="primary">
          {task ? "Save Changes" : "Create Task"}
        </Button>
      </Form>
    </GenericModalContainer>
  );
};

export default AddOrEditTaskModal;

/**
 * In order to avoid repetetive code I create this h5 since it always has the same styling
 */
