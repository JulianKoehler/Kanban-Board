import React, { useState, useEffect } from "react";
import uuid from "react-uuid";
import toast from "react-hot-toast";
import { IBoard, IColumn } from "@/types/data/board.model";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectActiveBoard, setActiveBoard } from "@/redux/slices/boardSlice";
import checkFormValidity from "@/util/checkFormValidity";
import Button from "@/components/UI/Button";
import Form from "@/components/UI/Formelements/Form";
import FormGroup from "@/components/UI/Formelements/FormGroup";
import H5 from "@/components/UI/Headings/H5";
import Input from "@/components/UI/InputFields/TextInput";
import GenericModalContainer from "@/components/UI/Modal/GenericModalContainer";
import { LoadingSpinner_TailSpin as TailSpin } from "@/components/UI/LoadingSpinner";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/config";
import {
  useCreateBoardMutation,
  useGetBoardListQuery,
  useUpdateBoardMutation,
} from "@/redux/slices/apiSlice";
import { BoardModalProps } from "@/types/component-props/boardModal.model";
import ColumnInputArea from "./ColumnInputArea";

const BoardModal = ({ board, onClose }: BoardModalProps) => {
  const dispatch = useAppDispatch();
  const [user] = useAuthState(auth);
  const { data: boardList } = useGetBoardListQuery(user?.uid ?? "");
  const [updateBoard, { isLoading: isUpdatingBoard, isError: errorUpdate }] = useUpdateBoardMutation();
  const [createBoard, { isLoading: isCreatingBoard, isError: errorCreation }] = useCreateBoardMutation();
  const isLoading = isUpdatingBoard || isCreatingBoard;
  const isError = errorUpdate || errorCreation;
  const isEditMode = board ? true : false;
  const boardIndex = isEditMode
    ? board!.index
    : boardList?.length && boardList.length > 0
    ? boardList![boardList!.length - 1].index + 1
    : 0;
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [boardName, setBoardName] = useState(board ? board.name : "");
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

    const response = new Promise(async (resolve, reject) => {
      try {
        const result = isEditMode ? await updateBoard(newBoardData) : await createBoard(newBoardData)
        resolve(result)
      } catch(error) {
        reject(error)
      }
    })

    toast.promise(response, {
      loading: "Sending...",
      success: `Your board has been ${isEditMode ? "updated" : "created"}!`,
      error: (err) =>
        `Could not ${
          isEditMode ? "update" : "create"
        } your board: ${err.toString()}`,
    });

    await response

    if (!isError) {
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
          <ColumnInputArea
            columns={columns}
            setColumns={setColumns}
            isFormSubmitted={isFormSubmitted}
            boardId={boardId}
          />
        </FormGroup>
        <Button type="submit" variant="primary" className="flex justify-center">
          {isLoading ? TailSpin : isEditMode ? "Save Changes" : "Create Board"}
        </Button>
      </Form>
    </GenericModalContainer>
  );
};

export default BoardModal;
