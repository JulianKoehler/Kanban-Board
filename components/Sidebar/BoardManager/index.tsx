import { useState } from "react";
import BoardModal from "../../Board/BoardModal";
import BoardIcon from "../../UI/Icons/BoardIcon";
import { BoardManagerProps } from "@/types/component-props/boardManager.model";

const BoardManager = ({
  isLoading,
  boardListLength,
  children,
}: BoardManagerProps) => {
  const [showCreateBoardModal, setShowCreateBoardModal] = useState(false);

  function handleBoardCreation() {
    setShowCreateBoardModal(true);
  }

  return (
    <>
      <div>
        <h4 className="mb-8 text-sm font-bold uppercase tracking-wide text-grey-medium tablet:pl-[1.2rem] desktop:pl-3">
          {isLoading ? "loading boards..." : `my boards (${boardListLength})`}
        </h4>
        {children}
        <button
          onClick={handleBoardCreation}
          className="flex items-center gap-[1.6rem] fill-purple-main py-[1.4rem] text-lg font-bold text-purple-main tablet:pl-[1.2rem] desktop:pl-3"
        >
          <BoardIcon /> + Create New Board
        </button>
      </div>
      {showCreateBoardModal && (
        <BoardModal onClose={() => setShowCreateBoardModal(false)} />
      )}
    </>
  );
};

export default BoardManager;
