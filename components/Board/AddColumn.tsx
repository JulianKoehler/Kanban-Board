import React, { useRef, useState } from "react";
import GenericModalContainer from "../UI/Modal/GenericModalContainer";
import Form from "../UI/Formelements/Form";
import H5 from "../UI/Headings/H5";
import Input from "../UI/InputFields/TextInput";
import Button from "../UI/Button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import useHttpRequest from "@/hooks/useHttpRequest";
import API_URLS from "@/util/API_URLs";
import { addColumn, selectactiveBoardData } from "@/redux/slices/boardSlice";
import { toast } from "react-hot-toast";
import uuid from "react-uuid";
import { IColumn } from "@/types/data";
import { LoadingSpinner_TailSpin } from "../UI/LoadingSpinner";

type Props = {
  onClose: () => void;
};

const AddColumn = ({ onClose }: Props) => {
  const dispatch = useAppDispatch();
  const { sendData, isLoading, hasError } = useHttpRequest();
  const boardData = useAppSelector(selectactiveBoardData);
  const [color, setColor] = useState("#67E2AE");
  const nameRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const newColumn: IColumn = {
      id: uuid(),
      boardId: boardData!.id,
      color,
      index: boardData!.columns?.length || 0,
      name: nameRef.current!.value,
      markedForDeletion: false,
    };

    const response = sendData("POST", API_URLS.addColumn, newColumn);

    toast.promise(response, {
      loading: "Sending...",
      success: "Column has been added!",
      error: (err) => `Could not add column: ${err.toString()}`,
    });

    await response;

    if (hasError) {
      throw new Error("Something went wrong.");
    }

    dispatch(addColumn(newColumn));
    onClose();
  }

  return (
    <GenericModalContainer
      onClose={onClose}
      additionalClassNames="gap-12 w-[48rem]"
    >
      <h2 className="text-xl font-bold">New Column</h2>
      <Form onSubmit={handleSubmit}>
        <H5>Name</H5>
        <div className="flex flex-row items-center gap-6">
          <Input ref={nameRef} />
          <input
            className="h-10 w-10"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
        <Button>{isLoading ? LoadingSpinner_TailSpin : "Add Column"}</Button>
      </Form>
    </GenericModalContainer>
  );
};

export default AddColumn;
