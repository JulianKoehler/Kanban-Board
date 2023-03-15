import { useState } from "react";
import Button from "../UI/Button";
import AddOrEditBoardModal from "./AddOrEditBoardModal";
import Column from "./Column";
import Task from "./Task";
import { LoadingSpinner_ThreeDots as LoadingSpinner } from "../UI/LoadingSpinner";
import { useAppSelector } from "@/redux/hooks";
import {
  selectActiveBoard,
  selectactiveBoardData,
  selectBoardDataStatus,
  selectBoardList,
  selectBoardListStatus,
  STATUS,
} from "@/redux/slices/boardSlice";

const Board = () => {
  const [showCreateBoardModal, setShowCreateBoardModal] = useState(false);
  const boardData = useAppSelector(selectactiveBoardData);
  const boardDataStatus = useAppSelector(selectBoardDataStatus);
  const boardListStatus = useAppSelector(selectBoardListStatus);
  const boardList = useAppSelector(selectBoardList);
  const activeBoard = useAppSelector(selectActiveBoard);

  return (
    <>
      <main
        className={`relative flex h-[calc(100vh-9.6rem)] gap-[2.4rem] overflow-auto bg-grey-light pl-[2.4rem] pt-[2.4rem] pb-40 dark:bg-grey-very-dark`}
      >
        {boardDataStatus === STATUS.LOADING ? (
          <div className="m-auto">{LoadingSpinner}</div>
        ) : (
          <>
            {boardData?.columns?.map((column, index) => (
              <Column key={column.id} column={column} index={index}>
                {column.tasks?.map((task, index) => (
                  <Task
                    key={task.id}
                    currentBoard={boardData}
                    task={task}
                    index={index}
                  />
                ))}
              </Column>
            ))}
            {boardData?.columns?.length! >= 1 ? (
              <div
                onClick={() => setShowCreateBoardModal(true)}
                className="mt-[4rem] flex min-w-[28rem] cursor-pointer items-center justify-center rounded-[0.6rem] bg-gradient-to-b from-[#E9EFFA] to-[#e9effa80] text-2xl font-bold text-grey-medium hover:text-purple-main dark:from-[#2b2c3740] dark:to-[#2b2c3721]"
              >
                + New Column
              </div>
            ) : boardListStatus === STATUS.SUCCESS ? (
              <div className="m-auto flex flex-col items-center justify-between gap-[4.7rem]">
                <p className="font-xl font-bold text-grey-medium">
                  {activeBoard
                    ? "This board is empty. Create a new column to get started."
                    : "You don't have any boards. Create one to get started."}
                </p>
                <Button
                  onClick={() => setShowCreateBoardModal(true)}
                  variant="primary"
                  large
                >
                  {activeBoard ? "+ Add New Column" : "+ Create New Board"}
                </Button>
              </div>
            ) : null}
          </>
        )}
      </main>
      {showCreateBoardModal && (
        <AddOrEditBoardModal
          onClose={() => setShowCreateBoardModal(false)}
          board={boardData}
        />
      )}
    </>
  );
};

export default Board;
