import React from "react";
import Button from "../Button";
import GenericModalContainer from "./GenericModalContainer";

type Props = {
  type: "board" | "task";
  title: string;
  DeleteButton: React.ReactNode;
  onClose: VoidFunction;
};

const DeletionWarning = ({ type, title, DeleteButton, onClose }: Props) => {
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
      <div className="flex w-full gap-[1.6rem]">
        {DeleteButton}
        <Button onClick={onClose} variant="secondary">
          Cancel
        </Button>
      </div>
    </GenericModalContainer>
  );
};

export default DeletionWarning;
