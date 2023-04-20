import React from "react";
import Button from "../Button";
import GenericModalContainer from "./GenericModalContainer";
import { LoadingSpinner_TailSpin as Tailspin } from "@/components/UI/LoadingSpinner";

type Props = {
  type: "board" | "task";
  title: string;
  isLoading: boolean;
  deleteFunction: VoidFunction;
  onClose: VoidFunction;
};

const DeletionWarning = ({
  type,
  title,
  isLoading,
  deleteFunction,
  onClose,
}: Props) => {
  function getWarningMessage() {
    switch (type) {
      case "board":
        return `Are you sure you want to delete the "${title}" board? This action will remove all columns and tasks and cannot be reversed.`;
      case "task":
        return `Are you sure you want to delete the "${title}" task and its subtasks? This action cannot be reversed.`;
    }
  }

  return (
    <GenericModalContainer
      additionalClassNames="w-[48rem] gap-[2.4rem]"
      onClose={onClose}
    >
      <h2 className="text-xl font-bold text-red">Delete this {type}?</h2>
      <p className="text-base font-medium text-grey-medium">
        {getWarningMessage()}
      </p>
      <div className="flex w-full flex-col gap-[1.6rem] tablet:flex-row">
        <Button
          variant="destructive"
          onClick={deleteFunction}
          additionalClassNames="flex justify-center"
        >
          {isLoading ? Tailspin : "Delete"}
        </Button>
        <Button onClick={onClose} variant="secondary">
          Cancel
        </Button>
      </div>
    </GenericModalContainer>
  );
};

export default DeletionWarning;
