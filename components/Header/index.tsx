import { useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  deleteBoardListItem,
  selectActiveBoard,
  selectactiveBoardData,
  selectBoardDataStatus,
  selectBoardList,
  setActiveBoard,
  STATUS,
} from "@/redux/slices/boardSlice";
import Image from "next/image";
import LogoLightMode from "@/public/assets/logo-dark.svg";
import LogoDarkMode from "@/public/assets/logo-light.svg";
import Button from "@/components/UI/Button";
import OptionsIcon from "@/public/assets/icon-vertical-ellipsis.svg";
import DropDownContainer from "@/components/UI/DropDown/DropDownContainer";
import useMenuHandler from "@/hooks/useMenuHandler";
import AddOrEditTaskModal from "../Board/Task/CreateOrEditTaskModal";
import AddOrEditBoardModal from "../Board/CreateOrEditBoardModal";
import DeletionWarning from "../UI/Modal/DeletionWarning";
import useHttpRequest from "@/hooks/useHttpRequest";
import API_URLS from "@/util/API_URLs";

type Props = {
  showSidebar: boolean;
  theme: string;
};

const Header = ({ showSidebar, theme }: Props) => {
  const dispatch = useAppDispatch();
  const boardList = useAppSelector(selectBoardList);
  const boardDataStatus = useAppSelector(selectBoardDataStatus);
  const menuRef = useRef<HTMLDivElement>(null);
  const board = useAppSelector(selectactiveBoardData);
  const activeBoard = useAppSelector(selectActiveBoard);
  const [showAddNewTaskModal, setShowAddNewTaskModal] = useState(false);
  const [showEditBoardModal, setShowEditBoardModal] = useState(false);
  const [showDeletionWarning, setShowDeletionWarning] = useState(false);
  const { showElement: showMenu, setShowElement: setShowMenu } =
    useMenuHandler(menuRef);
  const { isLoading, hasError, deleteData } = useHttpRequest();
  const columnsExist = board?.columns && board?.columns?.length > 0;

  function handleEditCurrentBoard() {
    setShowEditBoardModal(true);
  }

  async function handleDeleteCurrentBoard() {
    await deleteData(API_URLS.deleteBoard, board!);

    if (hasError) {
      throw new Error("Something went wrong.");
    }

    setShowDeletionWarning(false);
    if (boardList.length > 0) {
      dispatch(setActiveBoard(boardList[0]));
    }
    dispatch(deleteBoardListItem(board!.id));
    dispatch(setActiveBoard(boardList[0] || null));
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
          {activeBoard?.name || ""}
        </h1>
        <div className="relative ml-auto flex gap-[1rem]">
          {boardDataStatus === STATUS.SUCCESS && columnsExist ? (
            <Button large variant="primary" onClick={onAddNewTask}>
              +Add New Task
            </Button>
          ) : null}
          {boardDataStatus === STATUS.SUCCESS && (
            <>
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
                    onClick={() => setShowDeletionWarning(true)}
                    className="rounded-b-xl px-[1.6rem] pt-[0.8rem] pb-[1.6rem] text-left text-base font-medium text-red hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Delete Board
                  </button>
                </DropDownContainer>
              )}
            </>
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
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export default Header;
