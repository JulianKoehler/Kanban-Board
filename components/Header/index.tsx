import { IBoard } from "@/types/data";
import Image from "next/image";
import Button from "../UI/Button";
import OptionsIcon from "../../public/assets/icon-vertical-ellipsis.svg";
import { useEffect, useRef, useState } from "react";
import ThreeDotsModalContainer from "../UI/Modal/ThreeDotsModalContainer";

type Props = {
  board: IBoard;
};

const Header = ({ board }: Props) => {
  const [showEditBoardModal, setShowEditBoardModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowEditBoardModal(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  function handleEditCurrentBoard() {
    // open EditBoardModal
  }

  function handleDeleteCurrentBoard() {
    // open DeleteBoardModal
  }

  return (
    <header className="flex h-[9.6rem] items-center justify-between border-b border-lines-light bg-white pr-[2.2rem] pl-[2.4rem] dark:border-lines-dark dark:bg-grey-dark">
      <h1 className="text-2xl font-bold">{board.name}</h1>
      <div className="relative flex gap-[1rem]">
        <Button large variant="primary">
          +Add New Task
        </Button>
        <button
          onClick={() => setShowEditBoardModal((prevState) => !prevState)}
          className="px-[1rem]"
        >
          <Image src={OptionsIcon} alt="options" />
        </button>
        {showEditBoardModal && (
          <ThreeDotsModalContainer
            additionalClassNames="absolute right-0 top-[6rem]"
            handleEdit={handleEditCurrentBoard}
            handleDelete={handleDeleteCurrentBoard}
            ref={menuRef}
          />
        )}
      </div>
    </header>
  );
};

export default Header;
