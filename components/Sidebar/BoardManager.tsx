import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectActiveBoard,
  selectBoardList,
  selectBoardListStatus,
  setActiveBoard,
  STATUS,
} from "@/redux/slices/boardSlice";
import { useState } from "react";
import AddOrEditBoardModal from "../Board/CreateOrEditBoardModal";
import BoardIcon from "../UI/Icons/BoardIcon";
import useViewport from "@/hooks/useViewport";
import localStorageIdentifiers from "@/util/localStorageIdentifiers";

type Props = {
  onMobileClose?: VoidFunction;
};

const BoardManager = ({ onMobileClose }: Props) => {
  const [showCreateBoardModal, setShowCreateBoardModal] = useState(false);
  const boardList = useAppSelector(selectBoardList);
  const activeBoard = useAppSelector(selectActiveBoard);
  const status = useAppSelector(selectBoardListStatus);
  const [isMobile, isTablet] = useViewport();
  const dispatch = useAppDispatch();

  const boards = boardList?.map((board, index) => {
    const active = activeBoard?.id === board.id;
    const maxNameLength = isTablet ? 18 : 20;

    function handleBoardSelection() {
      const newBoard = boardList[index];

      dispatch(setActiveBoard(newBoard));

      localStorage.setItem(
        localStorageIdentifiers.activeBoard,
        JSON.stringify(newBoard)
      );

      isMobile ? onMobileClose!() : null;
    }

    return (
      <button
        key={board.id}
        onClick={handleBoardSelection}
        className={`relative left-[-2.4rem] flex w-[24rem] gap-[1.6rem] overflow-y-auto overflow-x-hidden whitespace-nowrap rounded-r-[2.4rem] py-[1.4rem] pl-[2.4rem] text-lg font-bold transition-colors duration-300 tablet:left-[-1.2rem] tablet:min-w-[24rem] desktop:left-[-2.4rem] desktop:w-[27.6rem] desktop:pl-[3.2rem] ${
          active && "bg-purple-main fill-white text-white"
        } ${
          !active &&
          "dark:hover:bg-white> fill-grey-medium text-grey-medium hover:bg-button-secondary-lightmode-idle hover:fill-purple-main hover:text-purple-main dark:hover:bg-white"
        }`}
      >
        <BoardIcon />
        {board.name.slice(0, maxNameLength)}
        {board.name.length >= maxNameLength ? "..." : ""}
      </button>
    );
  });

  function handleBoardCreation() {
    setShowCreateBoardModal(true);
  }

  return (
    <>
      <div>
        <h4 className="mb-8 text-sm font-bold uppercase tracking-wide text-grey-medium tablet:pl-[1.2rem] desktop:pl-3">
          {status === STATUS.LOADING
            ? "loading boards..."
            : `all boards (${boardList?.length ?? 0})`}
        </h4>
        {boards}
        <button
          onClick={handleBoardCreation}
          className="flex items-center gap-[1.6rem] fill-purple-main py-[1.4rem] text-lg font-bold text-purple-main tablet:pl-[1.2rem] desktop:pl-3"
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
