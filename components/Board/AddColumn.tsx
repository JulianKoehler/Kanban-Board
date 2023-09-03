import React, { useRef, useState } from "react";
import GenericModalContainer from "../UI/Modal/GenericModalContainer";
import Form from "../UI/Formelements/Form";
import H5 from "../UI/Headings/H5";
import Input from "../UI/InputFields/TextInput";
import Button from "../UI/Button";
import { toast } from "react-hot-toast";
import uuid from "react-uuid";
import { IBoard, IColumn } from "@/types/data/board.model";
import { LoadingSpinner_TailSpin } from "../UI/LoadingSpinner";
import { useCreateColumnMutation } from "@/redux/slices/apiSlice";

type Props = {
  onClose: () => void;
  boardData: IBoard | undefined;
};

const AddColumn = ({ onClose, boardData }: Props) => {
  const [createNewColumn, result] = useCreateColumnMutation();
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

    const response = createNewColumn(newColumn);

    toast.promise(response, {
      loading: "Sending...",
      success: "Column has been added!",
      error: (err) => `Could not add column: ${result.error}`,
    });

    await response;
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
        <Button>
          {result.isLoading ? LoadingSpinner_TailSpin : "Add Column"}
        </Button>
      </Form>
    </GenericModalContainer>
  );
};

export default AddColumn;
