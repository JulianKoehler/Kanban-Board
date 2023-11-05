import { useEffect, useState } from "react";
import BoardModal from "./BoardModal";
import Column from "./Column";
import Task from "./Task";
import { LoadingSpinner_ThreeDots as LoadingSpinner } from "@/components/UI/LoadingSpinner";
import { useAppSelector } from "@/redux/hooks";
import { selectActiveBoard } from "@/redux/slices/boardSlice";
import ErrorFeedback from "../UI/UserFeedback/ErrorFeedback";
import AddColumn from "./AddColumn";
import { BoardDataProps } from "@/types/component-props/board.model";
import {
  useGetBoardDataQuery,
  useGetBoardListQuery,
} from "@/redux/slices/apiSlice";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { selectUser } from "@/redux/slices/authSlice";
import NoBoardData from "./NoBoardData";
import LoadingSkeleton from "../UI/LoadingSkeleton";

const Board = ({ isSuccessBoardList, errorBoardList }: BoardDataProps) => {
  const activeBoard = useAppSelector(selectActiveBoard);
  const user = useAppSelector(selectUser);
  const { data: boardList } = useGetBoardListQuery(user?.uid ?? "");
  const {
    data: boardData,
    isLoading: isLoadingBoardData,
    error: errorBoardData,
    refetch: fetchNewBoardData,
  } = useGetBoardDataQuery(activeBoard?.id ? activeBoard?.id : skipToken);

  const [showCreateBoardModal, setShowCreateBoardModal] = useState(false);
  const [showAddColumnModal, setShowAddColumnModal] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const dataError = !!errorBoardData || !!errorBoardList;
  const [errorHeaderMessage, setErrorHeaderMessage] = useState<
    undefined | string
  >();
  const [errorDescriptionMessage, setErrorDescriptionMessage] = useState<
    undefined | string
  >();

  useEffect(() => {
    activeBoard && fetchNewBoardData();
  }, [activeBoard]);

  useEffect(() => {
    if (dataError) setShowErrorMessage(true);

    if (errorBoardList) {
      setErrorHeaderMessage("Failed to load Boardlist!");
      setErrorDescriptionMessage(
        "We are sorry, but currently we are not able to load your boards. Please try again later."
      );
    }
    if (errorBoardData) {
      setErrorHeaderMessage("Failed to load this Board!");
      setErrorDescriptionMessage(
        "We are sorry, but currently we are not able to load this board. Please try again later."
      );
    }
  }, [dataError]);

  return (
    <>
      <main
        className={`relative flex h-[calc(100vh-6.4rem)] gap-[2.4rem] overflow-auto bg-grey-light px-[1.6rem] pt-[2.4rem] dark:bg-grey-very-dark tablet:h-[calc(100vh-9.6rem)] tablet:pl-[2.4rem] tablet:pb-40`}
      >
        {isLoadingBoardData ? (
          <LoadingSkeleton count={4} />
        ) : errorBoardList && showErrorMessage ? (
          <ErrorFeedback
            header={errorHeaderMessage}
            description={errorDescriptionMessage}
            onClose={() => setShowErrorMessage(false)}
          />
        ) : (
          <>
            {boardData?.columns?.map((column) => (
              <Column key={column.id} column={column}>
                {column.tasks?.map((task, idx) => (
                  <Task key={task.id} currentBoard={boardData!} task={task} index={idx} />
                ))}
              </Column>
            ))}
            {boardData?.columns?.length! >= 1 ? (
              <div
                onClick={() => setShowAddColumnModal(true)}
                className="mt-[4rem] flex min-w-[28rem] cursor-pointer items-center justify-center rounded-[0.6rem] bg-gradient-to-b from-[#E9EFFA] to-[#e9effa80] text-2xl font-bold text-grey-medium hover:text-purple-main dark:from-[#2b2c3740] dark:to-[#2b2c3721]"
              >
                + New Column
              </div>
            ) : isSuccessBoardList ? (
              <NoBoardData
                activeBoard={activeBoard}
                boardList={boardList}
                setShowAddColumnModal={setShowAddColumnModal}
                setShowCreateBoardModal={setShowCreateBoardModal}
              />
            ) : null}
          </>
        )}
      </main>
      <BoardModal
        showModal={showCreateBoardModal}
        onClose={() => setShowCreateBoardModal(false)}
      />

      <AddColumn
        onClose={() => setShowAddColumnModal(false)}
        showModal={showAddColumnModal}
        boardData={boardData}
      />
    </>
  );
};

export default Board;
