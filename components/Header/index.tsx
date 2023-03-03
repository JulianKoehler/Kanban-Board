import { IBoard } from "@/types/data";
import Image from "next/image";
import LogoLightMode from "@/public/assets/logo-dark.svg";
import LogoDarkMode from "@/public/assets/logo-light.svg";
import Button from "@/components/UI/Button";
import OptionsIcon from "@/public/assets/icon-vertical-ellipsis.svg";
import { useRef, useState } from "react";
import DropDownContainer from "@/components/UI/Modal/DropDownContainer";
import useMenuHandler from "@/hooks/useMenuHandler";
import AddNewTaskModal from "./AddNewTaskModal";

type Props = {
  board: IBoard | null;
  showSidebar: boolean;
  theme: string;
};

const Header = ({ board, showSidebar, theme }: Props) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [showAddNewTaskModal, setShowAddNewTaskModal] = useState(false);
  const { showElement: showMenu, setShowElement: setShowMenu } =
    useMenuHandler(menuRef);

  function handleEditCurrentBoard() {
    // open EditBoardModal
  }

  function handleDeleteCurrentBoard() {
    // open DeleteBoardModal
  }

  function onAddNewTask() {
    setShowAddNewTaskModal(true);
  }

  function onCloseNewTask() {
    setShowAddNewTaskModal(false);
  }

  return (
    <>
      <header className="flex h-[9.6rem] items-center justify-start border-b border-lines-light bg-white pr-[2.2rem] pl-[2.4rem] dark:border-lines-dark dark:bg-grey-dark">
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
          <Button large variant="primary" onClick={onAddNewTask}>
            +Add New Task
          </Button>
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
              <button
                onClick={handleDeleteCurrentBoard}
                className="rounded-b-xl px-[1.6rem] pt-[0.8rem] pb-[1.6rem] text-left text-base font-medium text-red hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Delete Board
              </button>
            </DropDownContainer>
          )}
        </div>
      </header>
      {showAddNewTaskModal && (
        <AddNewTaskModal
          statusOptions={board?.columns}
          onClose={onCloseNewTask}
        />
      )}
    </>
  );
};

export default Header;
