import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectActiveBoard,
  selectBoardList,
  setActiveBoard,
} from "@/redux/slices/boardSlice";
import { IBoard, KanbanData } from "@/types/data";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import AddOrEditBoardModal from "../Board/AddOrEditBoardModal";
import BoardIcon from "../UI/Icons/BoardIcon";

type Props = {
  activeBoard: IBoard | undefined;
};

const BoardManager = () => {
  const [showCreateBoardModal, setShowCreateBoardModal] = useState(false);
  const boardList = useAppSelector(selectBoardList);
  const activeBoard = useAppSelector(selectActiveBoard);
  const dispatch = useAppDispatch();

  const boards = boardList?.map((board, index) => {
    const active = activeBoard?.id === board.id;

    return (
      <button
        key={board.id}
        onClick={() => dispatch(setActiveBoard(boardList[index]))}
        className={`relative left-[-2.4rem] flex gap-[1.6rem] rounded-r-[2.4rem] py-[1.4rem] pl-[3.2rem] text-lg font-bold transition-colors duration-300 desktop:min-w-[27.6rem] ${
          active && "bg-purple-main fill-white text-white"
        } ${
          !active &&
          "dark:hover:bg-white> fill-grey-medium text-grey-medium hover:bg-button-secondary-lightmode-idle hover:fill-purple-main hover:text-purple-main dark:hover:bg-white"
        }`}
      >
        <BoardIcon />
        {board.name}
      </button>
    );
  });

  return (
    <>
      <div>
        <h4 className="mb-8 pl-3 text-sm font-bold uppercase tracking-wide text-grey-medium">
          all boards ({boardList.length})
        </h4>
        {boards}
        <button
          onClick={() => setShowCreateBoardModal(true)}
          className="flex items-center gap-[1.6rem] fill-purple-main py-[1.4rem] pl-3 text-lg font-bold text-purple-main"
        >
          <BoardIcon /> + Create New Board
        </button>
      </div>
      {showCreateBoardModal && (
        <AddOrEditBoardModal onClose={() => setShowCreateBoardModal(false)} />
      )}
    </>
  );
};

export default BoardManager;
