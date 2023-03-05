import { IBoard } from "@/types/data";
import checkFormValidity from "@/util/checkFormValidity";
import React, { useState } from "react";
import uuid from "react-uuid";
import Button from "../UI/Button";
import Form from "../UI/Formelements/Form";
import FormGroup from "../UI/Formelements/FormGroup";
import H5 from "../UI/Headings/H5";
import DeleteIcon from "../UI/Icons/DeleteIcon";
import TextInput from "../UI/InputFields/TextInput";
import GenericModalContainer from "../UI/Modal/GenericModalContainer";

type Props = {
  onClose: VoidFunction;
  board?: IBoard | null;
};

const AddOrEditBoardModal = ({ board, onClose }: Props) => {
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [name, setName] = useState(board?.name ?? "");
  const [columns, setColumns] = useState(
    board?.columns ?? [
      {
        id: uuid(),
        name: "",
        tasks: [],
      },
    ]
  );

  const columnsInputFields = columns.map((column, index) => (
    <div key={column.id} className="relative flex gap-[1.6rem]">
      <TextInput
        value={column.name}
        additionalClasses={
          isFormSubmitted && column.name.length < 1 ? "input-error" : ""
        }
        onChange={(e) => handleColumnInput(e, index)}
        placeholder="e.g. Backlog"
      />
      <button
        type="button"
        onClick={() => onDeleteColumnInput(column.id)}
        className="aspect-square w-[1.485rem] fill-grey-medium transition-colors duration-200 hover:fill-red"
      >
        <DeleteIcon />
      </button>
      {column.name.length < 1 && isFormSubmitted && (
        <p className="absolute bottom-[0.9rem] right-[4.6rem] text-base font-medium text-red">
          Can't be empty
        </p>
      )}
    </div>
  ));

  function handleColumnInput(
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) {
    setColumns((prevColumns) => {
      let columns = [...prevColumns];

      columns[index] = {
        ...columns[index],
        name: e.target.value,
      };

      return columns;
    });
  }

  function onDeleteColumnInput(id: string | number) {
    setColumns((prev) => prev.filter((column) => column.id !== id));
  }

  function onAddNewColumnInput() {
    setColumns((prev) => [
      ...prev,
      {
        id: uuid(),
        name: "",
        tasks: [],
      },
    ]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsFormSubmitted(true);

    const toBeValidated = [name];
    columns.forEach((column) => {
      toBeValidated.push(column.name);
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
          {board ? "Edit Board" : "Add New Board"}
        </h2>
        <FormGroup>
          <H5>Name</H5>
          <TextInput
            additionalClasses={
              isFormSubmitted && name.length < 1 ? "input-error" : ""
            }
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Web Design"
          />
          {isFormSubmitted && name.length < 1 && (
            <p className="absolute bottom-[0.9rem] right-[1.6rem] text-base font-medium text-red">
              Can't be empty
            </p>
          )}
        </FormGroup>
        <FormGroup className="flex flex-col gap-[1.6rem]">
          <H5>Subtasks</H5>
          <div className="flex max-h-[14.7rem] flex-col gap-[1.2rem] overflow-y-auto">
            {columnsInputFields}
          </div>
          <Button
            variant="secondary"
            type="button"
            onClick={onAddNewColumnInput}
          >
            + Add New Column
          </Button>
        </FormGroup>
        <Button type="submit" variant="primary">
          {board ? "Save Changes" : "Create Board"}
        </Button>
      </Form>
    </GenericModalContainer>
  );
};

export default AddOrEditBoardModal;
