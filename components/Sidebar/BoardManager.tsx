import { Board, KanbanData } from "@/types/data";
import { Dispatch, SetStateAction } from "react";
import BoardIcon from "../UI/Icons/BoardIcon";

type Props = {
  initialData: KanbanData;
  activeBoard: Board;
  setActiveBoard: Dispatch<SetStateAction<Board>>;
};

const BoardManager = ({ initialData, activeBoard, setActiveBoard }: Props) => {
  const boards = initialData.map((board, index) => {
    const active = activeBoard.name === board.name;

    return (
      <button
        key={board.id}
        onClick={() => setActiveBoard(initialData[index])}
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
    <div>
      <h4 className="mb-8 pl-3 text-sm font-bold uppercase tracking-wide text-grey-medium">
        all boards ({initialData.length})
      </h4>
      {boards}
      <button className="flex items-center gap-[1.6rem] fill-purple-main py-[1.4rem] pl-3 text-lg font-bold text-purple-main">
        <BoardIcon /> + Create New Board
      </button>
    </div>
  );
};

export default BoardManager;
