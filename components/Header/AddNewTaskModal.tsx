import { IColumn } from "@/types/data";
import React, { useState } from "react";
import GenericModalContainer from "../UI/Modal/GenericModalContainer";
import TextInput from "../UI/InputFields/TextInput";
import DeleteIcon from "../UI/Icons/DeleteIcon";
import Button from "../UI/Button";
import DropDown from "../UI/InputFields/DropDown";
import uuid from "react-uuid";

type Props = {
  onClose: VoidFunction;
  statusOptions: IColumn[];
};

const AddNewTaskModal = ({ onClose, statusOptions }: Props) => {
  const [subtasks, setSubtasks] = useState([
    {
      id: uuid(),
      title: "",
      isCompleted: false,
    },
  ]);

  const subtaskInputFields = subtasks.map((subtask) => (
    <div className="flex gap-[1.6rem]">
      <TextInput
        value={subtask.title}
        onChange={handleSubtaskInput}
        placeholder="e.g. Make coffee"
      />
      <button
        type="button"
        className="aspect-square w-[1.485rem] fill-grey-medium transition-colors duration-200 hover:fill-red"
      >
        <DeleteIcon />
      </button>
    </div>
  ));

  function handleSubtaskInput(e: React.ChangeEvent) {
    // setSubtasks();
  }

  function onAddNewInput() {
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
  }

  return (
    <GenericModalContainer onClose={onClose} additionalClassNames="w-[48rem]">
      <form className="flex flex-col gap-[2.4rem]" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold">Add New Task</h2>
        <fieldset className="flex flex-col gap-[1.6rem]">
          <Heading5>Title</Heading5>
          <TextInput placeholder="e.g. Take coffee break" />
        </fieldset>
        <fieldset className="flex flex-col gap-[1.6rem]">
          <Heading5>Description</Heading5>
          <textarea
            className="h-[11.2rem] w-full resize-none rounded-[0.4rem] border-[0.1rem] border-[#828fa340] px-[1.6rem] py-[0.8rem] text-base focus:border-purple-main focus:outline-none"
            placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little."
          />
        </fieldset>
        <fieldset className="flex flex-col gap-[1.6rem]">
          <Heading5>Subtasks</Heading5>
          {subtaskInputFields}
          <Button variant="secondary" type="button" onClick={onAddNewInput}>
            + Add New Subtask
          </Button>
        </fieldset>
        <fieldset className="flex flex-col gap-[0.8rem]">
          <Heading5>Status</Heading5>
          <DropDown columns={statusOptions} />
        </fieldset>
        <Button type="submit" variant="primary">
          Create Task
        </Button>
      </form>
    </GenericModalContainer>
  );
};

export default AddNewTaskModal;

const Heading5 = ({ children }: { children: React.ReactNode }) => (
  <h5 className="text-sm font-bold text-grey-medium">{children}</h5>
);
