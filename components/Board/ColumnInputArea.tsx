import { IColumn } from "@/types/data/board.model";
import React from "react";
import Input from "../UI/InputFields/TextInput";
import DeleteIcon from "../UI/Icons/DeleteIcon";
import Button from "../UI/Button";
import uuid from "react-uuid";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  columns: IColumn[];
  setColumns: React.Dispatch<React.SetStateAction<IColumn[]>>;
  isFormSubmitted: boolean;
  boardId: string;
};

const ColumnInputArea = ({
  columns,
  setColumns,
  isFormSubmitted,
  boardId,
}: Props) => {
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
        color: "#49e57d",
        markedForDeletion: false,
        index: columns.length,
        boardId,
        tasks: [],
      },
    ]);
  }

  return (
    <>
      <div className="flex max-h-[14.7rem] flex-col gap-[1.2rem] overflow-y-auto">
        <AnimatePresence>
          {columns.map((column, index) => {
            return column.markedForDeletion ? null : (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                key={column.id}
                className="relative flex items-center gap-[1.6rem]"
              >
                <Input
                  value={column.name}
                  className={
                    isFormSubmitted && column.name.length < 1
                      ? "input-error"
                      : ""
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
                  <p className="absolute bottom-[0.9rem] right-[8.6rem] text-base font-medium text-red">
                    Can't be empty
                  </p>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      <Button variant="secondary" type="button" onClick={onAddNewColumnInput}>
        + Add New Column
      </Button>
    </>
  );
};

export default ColumnInputArea;
