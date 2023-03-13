import useHttpRequest from "@/hooks/useHttpRequest";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addBoard,
  selectBoardList,
  setActiveBoard,
  updateBoardList,
} from "@/redux/slices/boardSlice";
import { IBoard, IColumn } from "@/types/data";
import checkFormValidity from "@/util/checkFormValidity";
import React, { useState } from "react";
import uuid from "react-uuid";
import Button from "@/components/UI/Button";
import Form from "@/components/UI/Formelements/Form";
import FormGroup from "@/components/UI/Formelements/FormGroup";
import H5 from "@/components/UI/Headings/H5";
import DeleteIcon from "@/components/UI/Icons/DeleteIcon";
import TextInput from "@/components/UI/InputFields/TextInput";
import GenericModalContainer from "@/components/UI/Modal/GenericModalContainer";
import { LoadingSpinner_TailSpin as TailSpin } from "@/components/UI/LoadingSpinner";
import API_URLS from "@/util/API_URLs";

type Props = {
  onClose: VoidFunction;
  board?: IBoard;
};

const AddOrEditBoardModal = ({ board, onClose }: Props) => {
  const dispatch = useAppDispatch();
  const boardList = useAppSelector(selectBoardList);
  const boardIndex = board
    ? board.index
    : boardList
    ? boardList[boardList.length - 1].index + 1
    : 0;
  const isEditMode = board ? true : false;
  const { isLoading, hasError, sendData } = useHttpRequest();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [boardName, setBoardName] = useState<string>(board ? board?.name : "");
  const boardId = board?.id ?? uuid();
  const [columns, setColumns] = useState<IColumn[]>(
    isEditMode
      ? (board?.columns as IColumn[])
      : [
          {
            id: uuid(),
            index: 0,
            name: "",
            boardId,
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
      const columns = [...prevColumns];

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
        index: columns.length,
        boardId,
        tasks: [],
      },
    ]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsFormSubmitted(true);

    const toBeValidated = [boardName];
    columns.forEach((column) => {
      toBeValidated.push(column.name);
    });
    const isFormValid = checkFormValidity(toBeValidated);

    if (!isFormValid) {
      return;
    }

    const newBoardData = {
      name: boardName,
      id: boardId,
      index: boardIndex,
      columns: [...columns],
    };

    await sendData(
      isEditMode ? "PATCH" : "POST",
      API_URLS.addBoard,
      newBoardData
    );

    if (hasError) {
      throw new Error("Something went wrong.");
    }

    isEditMode
      ? dispatch(updateBoardList(newBoardData))
      : dispatch(addBoard(newBoardData));

    if (!isLoading) {
      dispatch(
        setActiveBoard({
          name: newBoardData.name,
          id: newBoardData.id,
          index: newBoardData.index,
        })
      );
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
          {isEditMode ? "Edit Board" : "Add New Board"}
        </h2>
        <FormGroup>
          <H5>Name</H5>
          <TextInput
            additionalClasses={
              isFormSubmitted && boardName.length < 1 ? "input-error" : ""
            }
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            placeholder="e.g. Web Design"
          />
          {isFormSubmitted && boardName.length < 1 && (
            <p className="absolute bottom-[0.9rem] right-[1.6rem] text-base font-medium text-red">
              Can't be empty
            </p>
          )}
        </FormGroup>
        <FormGroup className="flex flex-col gap-[1.6rem]">
          <H5>Columns</H5>
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
        <Button
          type="submit"
          variant="primary"
          additionalClassNames="flex justify-center"
        >
          {isLoading ? TailSpin : isEditMode ? "Save Changes" : "Create Board"}
        </Button>
      </Form>
    </GenericModalContainer>
  );
};

export default AddOrEditBoardModal;
