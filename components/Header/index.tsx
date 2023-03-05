import { IBoard } from "@/types/data";
import Image from "next/image";
import LogoLightMode from "@/public/assets/logo-dark.svg";
import LogoDarkMode from "@/public/assets/logo-light.svg";
import Button from "@/components/UI/Button";
import OptionsIcon from "@/public/assets/icon-vertical-ellipsis.svg";
import { useRef, useState } from "react";
import DropDownContainer from "@/components/UI/DropDown/DropDownContainer";
import useMenuHandler from "@/hooks/useMenuHandler";
import AddOrEditTaskModal from "../Board/Task/AddOrEditTaskModal";
import AddOrEditBoardModal from "../Board/AddOrEditBoardModal";
import DeletionWarning from "../UI/Modal/DeletionWarning";

type Props = {
  board: IBoard | null;
  showSidebar: boolean;
  theme: string;
};

const Header = ({ board, showSidebar, theme }: Props) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [showAddNewTaskModal, setShowAddNewTaskModal] = useState(false);
  const [showEditBoardModal, setShowEditBoardModal] = useState(false);
  const [showDeletionWarning, setShowDeletionWarning] = useState(false);
  const { showElement: showMenu, setShowElement: setShowMenu } =
    useMenuHandler(menuRef);

  function handleEditCurrentBoard() {
    setShowEditBoardModal(true);
  }

  function handleDeleteCurrentBoard() {
    console.info("Sending a DELETE-Request to the database...");
  }

  function onAddNewTask() {
    setShowAddNewTaskModal(true);
  }

  function onCloseNewTask() {
    setShowAddNewTaskModal(false);
  }

  return (
    <>
      <header className="flex h-[9.6rem] max-w-[100%] items-center justify-start border-b border-lines-light bg-white pr-[2.2rem] pl-[2.4rem] dark:border-lines-dark dark:bg-grey-dark">
        {!showSidebar && (
          <div className="flex h-full items-center border-r-[0.1rem] border-lines-light pr-[3.2rem] dark:border-lines-dark">
            <Image
              src={theme === "dark" ? LogoDarkMode : LogoLightMode}
              alt="kanban-logo"
            />
          </div>
        )}
        <h1 className={`text-2xl font-bold ${!showSidebar && "ml-[3.2rem]"}`}>
          {board?.name}
        </h1>
        <div className="relative ml-auto flex gap-[1rem]">
          {board?.columns ? (
            <Button large variant="primary" onClick={onAddNewTask}>
              +Add New Task
            </Button>
          ) : null}
          <button
            onClick={() => setShowMenu((prevState) => !prevState)}
            className="px-[1rem]"
          >
            <Image src={OptionsIcon} alt="options" />
          </button>
          {showMenu && (
            <DropDownContainer
              additionalClassNames="absolute right-0 top-[6rem]"
              ref={menuRef}
            >
              <button
                onClick={handleEditCurrentBoard}
                className="w-full rounded-t-xl px-[1.6rem] pt-[1.6rem] pb-[0.8rem] text-left text-base font-medium text-grey-medium hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Edit Board
              </button>
              {board && (
                <button
                  onClick={() => setShowDeletionWarning(true)}
                  className="rounded-b-xl px-[1.6rem] pt-[0.8rem] pb-[1.6rem] text-left text-base font-medium text-red hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Delete Board
                </button>
              )}
            </DropDownContainer>
          )}
        </div>
      </header>
      {showAddNewTaskModal && (
        <AddOrEditTaskModal
          statusOptions={board?.columns!}
          onClose={onCloseNewTask}
        />
      )}
      {showEditBoardModal && (
        <AddOrEditBoardModal
          board={board}
          onClose={() => setShowEditBoardModal(false)}
        />
      )}
      {showDeletionWarning && (
        <DeletionWarning
          title={board!.name}
          type="board"
          onClose={() => setShowDeletionWarning(false)}
          deleteFunction={handleDeleteCurrentBoard}
        />
      )}
    </>
  );
};

export default Header;
