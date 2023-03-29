import { useEffect, useState } from "react";
import Button from "../UI/Button";
import AddOrEditBoardModal from "./AddOrEditBoardModal";
import Column from "./Column";
import Task from "./Task";
import { LoadingSpinner_ThreeDots as LoadingSpinner } from "@/components/UI/LoadingSpinner";
import { useAppSelector } from "@/redux/hooks";
import {
  selectActiveBoard,
  selectactiveBoardData,
  selectBoardDataStatus,
  selectBoardListStatus,
  selectError,
  STATUS,
} from "@/redux/slices/boardSlice";
import ErrorFeedback from "../UI/UserFeedback/ErrorFeedback";

const Board = () => {
  const [showCreateBoardModal, setShowCreateBoardModal] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const boardData = useAppSelector(selectactiveBoardData);
  const boardDataStatus = useAppSelector(selectBoardDataStatus);
  const boardListStatus = useAppSelector(selectBoardListStatus);
  const activeBoard = useAppSelector(selectActiveBoard);
  const error = useAppSelector(selectError);
  const [errorHeaderMessage, setErrorHeaderMessage] = useState<
    undefined | string
  >();
  const [errorDescriptionMessage, setErrorDescriptionMessage] = useState<
    undefined | string
  >();

  console.log(boardData);

  useEffect(() => {
    if (error) setShowErrorMessage(true);

    if (error === "ERR_BOARDLIST") {
      setErrorHeaderMessage("Failed to load Boardlist!");
      setErrorDescriptionMessage(
        "We are sorry, but currently we are not able to load your boards. Please try again later."
      );
    }
    if (error === "ERR_BOARDDATA") {
      setErrorHeaderMessage("Failed to load this Board!");
      setErrorDescriptionMessage(
        "We are sorry, but currently we are not able to load this board. Please try again later."
      );
    }
  }, [error]);

  return (
    <>
      <main
        className={`relative flex h-[calc(100vh-9.6rem)] gap-[2.4rem] overflow-auto bg-grey-light pl-[2.4rem] pt-[2.4rem] pb-40 dark:bg-grey-very-dark`}
      >
        {boardDataStatus === STATUS.LOADING ? (
          <div className="m-auto">{LoadingSpinner}</div>
        ) : boardListStatus === STATUS.FAILED && showErrorMessage ? (
          <ErrorFeedback
            header={errorHeaderMessage}
            description={errorDescriptionMessage}
            onClose={() => setShowErrorMessage(false)}
          />
        ) : (
          <>
            {boardData?.columns?.map((column, index) => (
              <Column key={column.id} column={column} index={index}>
                {column.tasks?.map((task) => (
                  <Task key={task.id} currentBoard={boardData} task={task} />
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
