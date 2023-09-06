import { BoardListItem } from "@/types/data/board.model";
import React from "react";
import Button from "../UI/Button";
import Image from "next/image";
import WelcomeImage from "@/public/assets/empty.png";

type Props = {
  activeBoard: BoardListItem | undefined;
  boardList: BoardListItem[] | undefined;
  setShowAddColumnModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowCreateBoardModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const NoBoardData = ({
  activeBoard,
  boardList,
  setShowAddColumnModal,
  setShowCreateBoardModal,
}: Props) => {
  const userHasBoards = boardList && boardList.length > 0;
  const nothingSelected = !activeBoard;

  return (
    <>
      <div className="m-auto flex flex-col items-center justify-between gap-[4.7rem]">
        <p className="text-center text-xl font-bold text-grey-medium">
          {activeBoard
            ? "This board is empty. Create a new column to get started."
            : boardList && boardList.length > 0
            ? "Welcome! Select one of your boards in the sidebar to get started"
            : "You don't have any boards. Create one to get started."}
        </p>
        {userHasBoards && nothingSelected && (
          <Image width={500} src={WelcomeImage} alt="person-with-smartphone" />
        )}
        {(!userHasBoards || !nothingSelected) && (
          <Button
            onClick={() => {
              activeBoard
                ? setShowAddColumnModal(true)
                : setShowCreateBoardModal(true);
            }}
            variant="primary"
            large
          >
            {activeBoard ? "+ Add New Column" : "+ Create New Board"}
          </Button>
        )}
      </div>
    </>
  );
};

export default NoBoardData;