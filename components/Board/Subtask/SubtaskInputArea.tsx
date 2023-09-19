import Button from "@/components/UI/Button";
import DeleteIcon from "@/components/UI/Icons/DeleteIcon";
import Input from "@/components/UI/InputFields/TextInput";
import { ISubtask } from "@/types/data/board.model";
import React from "react";
import uuid from "react-uuid";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  subtasks: ISubtask[];
  setSubtasks: React.Dispatch<React.SetStateAction<ISubtask[]>>;
  isFormSubmitted: boolean;
};

const SubtaskInputArea = ({
  subtasks,
  setSubtasks,
  isFormSubmitted,
}: Props) => {
  function handleSubtaskInput(index: number) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setSubtasks((prevSubtasks) => {
        const subtasks = [...prevSubtasks!];

        subtasks[index] = {
          ...subtasks[index],
          title: e.target.value,
        };

        return subtasks;
      });
    };
  }

  function onDeleteSubtaskInput(index: number) {
    return () => {
      setSubtasks((prevSubtasks) => {
        const subtasks = [...prevSubtasks!];

        subtasks[index] = {
          ...subtasks[index],
          markedForDeletion: true,
        };

        return subtasks;
      });
    };
  }

  function onAddNewSubtaskInput() {
    setSubtasks((prevSubtasks) => [
      ...prevSubtasks,
      {
        id: uuid(),
        index: subtasks.length,
        title: "",
        isCompleted: false,
        markedForDeletion: false,
      },
    ]);
  }
  return (
    <>
      <AnimatePresence>
        {subtasks.map((subtask, index) => {
          return subtask.markedForDeletion ? null : (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              key={subtask.id}
              className="relative flex gap-[1.6rem]"
            >
              <Input
                value={subtask.title}
                className={
                  isFormSubmitted && subtask.title.length < 1
                    ? "input-error"
                    : ""
                }
                onChange={handleSubtaskInput(index)}
                placeholder="e.g. Make coffee"
              />
              <button
                type="button"
                onClick={onDeleteSubtaskInput(index)}
                className="aspect-square w-[1.485rem] fill-grey-medium transition-colors duration-200 hover:fill-red"
              >
                <DeleteIcon />
              </button>
              {subtask.title.length < 1 && isFormSubmitted && (
                <p className="absolute bottom-[0.9rem] right-[4.6rem] text-base font-medium text-red">
                  Can't be empty
                </p>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
      <Button variant="secondary" type="button" onClick={onAddNewSubtaskInput}>
        + Add New Subtask
      </Button>
    </>
  );
};

export default SubtaskInputArea;
