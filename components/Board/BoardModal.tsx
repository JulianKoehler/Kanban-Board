import React, { useState } from "react";
import uuid from "react-uuid";
import toast from "react-hot-toast";
import { IBoard, IColumn } from "@/types/data";
import useHttpRequest from "@/hooks/useHttpRequest";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addBoard,
  selectBoardList,
  setActiveBoard,
  setBoardData,
  updateBoardList,
} from "@/redux/slices/boardSlice";
import checkFormValidity from "@/util/checkFormValidity";
import Button from "@/components/UI/Button";
import Form from "@/components/UI/Formelements/Form";
import FormGroup from "@/components/UI/Formelements/FormGroup";
import H5 from "@/components/UI/Headings/H5";
import DeleteIcon from "@/components/UI/Icons/DeleteIcon";
import Input from "@/components/UI/InputFields/TextInput";
import GenericModalContainer from "@/components/UI/Modal/GenericModalContainer";
import { LoadingSpinner_TailSpin as TailSpin } from "@/components/UI/LoadingSpinner";
import API_URLS from "@/util/API_URLs";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/config";

type Props = {
  onClose: VoidFunction;
  board?: IBoard;
};

const BoardModal = ({ board, onClose }: Props) => {
  const dispatch = useAppDispatch();
  const [user] = useAuthState(auth);
  const boardList = useAppSelector(selectBoardList);
  const boardIndex = board
    ? board.index
    : boardList.length > 0
    ? boardList[boardList.length - 1].index + 1
    : 0;
  const isEditMode = board ? true : false;
  const { isLoading, hasError, sendData } = useHttpRequest();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [boardName, setBoardName] = useState<string>(board ? board.name : "");
  const boardId = board?.id ?? uuid();
  const users = isEditMode ? board!.users : { creator: user!.uid };
  const [columns, setColumns] = useState<IColumn[]>(
    isEditMode
      ? (board?.columns as IColumn[])
      : [
          {
            id: uuid(),
            index: 0,
            color: "#49C4E5",
            markedForDeletion: false,
            name: "",
            boardId,
            tasks: [],
          },
        ]
  );

  const columnsInputFields = columns.map((column, index) => {
    return column.markedForDeletion ? null : (
      <div key={column.id} className="relative flex items-center gap-[1.6rem]">
        <Input
          value={column.name}
          className={
            isFormSubmitted && column.name.length < 1 ? "input-error" : ""
          }
          onChange={(e) => handleColumnInput(e, index)}
          placeholder="e.g. Backlog"
        />
        <button
          type="button"
          onClick={() => onDeleteColumnInput(index)}
          className="aspect-square w-[1.485rem] fill-grey-medium transition-colors duration-200 hover:fill-red"
        >
          <DeleteIcon />
        </button>
        <input
          onChange={(e) => onColorInput(e, index)}
          className="w-12"
          type="color"
          value={column.color}
        />
        {column.name.length < 1 && isFormSubmitted && (
          <p className="absolute bottom-[0.9rem] right-[4.6rem] text-base font-medium text-red">
            Can't be empty
          </p>
        )}
      </div>
    );
  });

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

  function onColorInput(e: React.ChangeEvent<HTMLInputElement>, index: number) {
    setColumns((prevColumns) => {
      const columns = [...prevColumns];

      columns[index] = {
        ...columns[index],
        color: e.target.value,
      };

      return columns;
    });
  }

  function onDeleteColumnInput(index: number) {
    setColumns((prevColumns) => {
      const columns = [...prevColumns];

      columns[index] = {
        ...columns[index],
        markedForDeletion: true,
      };

      return columns;
    });
  }

  function onAddNewColumnInput() {
    setColumns((prevColumns) => [
      ...prevColumns,
      {
        id: uuid(),
        name: "",
        color: "49C4E5",
        markedForDeletion: false,
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
      if (!column.markedForDeletion) {
        toBeValidated.push(column.name);
      }
    });
    const isFormValid = checkFormValidity(toBeValidated);

    if (!isFormValid) {
      return;
    }

    const newBoardData: IBoard = {
      name: boardName,
      id: boardId,
      index: boardIndex,
      columns,
      users,
    };

    const response = sendData(
      isEditMode ? "PATCH" : "POST",
      API_URLS.addOrEditBoard,
      newBoardData
    );

    toast.promise(response, {
      loading: "Sending...",
      success: `Your board has been ${isEditMode ? "updated" : "created"}!`,
      error: (err) =>
        `Could not ${
          isEditMode ? "update" : "create"
        } your board: ${err.toString()}`,
    });

    await response;

    if (hasError) {
      throw new Error("Something went wrong.");
    }

    if (isEditMode) {
      dispatch(
        updateBoardList({
          id: boardId,
          name: boardName,
          index: boardIndex,
          userId: auth.currentUser!.uid,
        })
      );
      dispatch(setBoardData(newBoardData));
    } else {
      dispatch(
        addBoard({
          id: boardId,
          name: boardName,
          index: boardIndex,
          userId: auth.currentUser!.uid,
        })
      );
    }

    if (!isLoading) {
      dispatch(
        setActiveBoard({
          name: newBoardData.name,
          id: newBoardData.id,
          index: newBoardData.index,
          userId: auth.currentUser!.uid,
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
          <Input
            className={
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

export default BoardModal;
