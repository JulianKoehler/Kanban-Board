import React from "react";
import Button from "../Button";
import GenericModalContainer from "./GenericModalContainer";
import { LoadingSpinner_TailSpin as Tailspin } from "@/components/UI/LoadingSpinner";
import { DeletionWarningProps } from "@/types/component-props/deletionWarning.model";

const DeletionWarning = ({
  type,
  title,
  isLoading,
  deleteFunction,
  onClose,
}: DeletionWarningProps) => {
  function getWarningMessage() {
    switch (type) {
      case "board":
        return `Are you sure you want to delete the "${title}" board? This action will remove all columns and tasks and cannot be reversed.`;
      case "task":
        return `Are you sure you want to delete the "${title}" task and its subtasks? This action cannot be reversed.`;
      case "user":
        return "Do you really want to delete your account? You will lose access to all of your boards, also the ones you created!";
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
          className="flex justify-center"
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
