import { useRef, useState } from "react";
import toast from "react-hot-toast";
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
import LogoMobile from "@/public/assets/logo-mobile.svg";
import AddIcon from "@/public/assets/icon-add-task-mobile.svg";
import Button from "@/components/UI/Button";
import OptionsIcon from "@/public/assets/icon-vertical-ellipsis.svg";
import DropDownContainer from "@/components/UI/DropDown/DropDownContainer";
import useMenuHandler from "@/hooks/useMenuHandler";
import AddOrEditTaskModal from "../Board/Task/CreateOrEditTaskModal";
import AddOrEditBoardModal from "../Board/CreateOrEditBoardModal";
import DeletionWarning from "../UI/Modal/DeletionWarning";
import useHttpRequest from "@/hooks/useHttpRequest";
import API_URLS from "@/util/API_URLs";
import useViewport from "@/hooks/useViewport";

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
  const isMobile = useViewport();

  function handleEditCurrentBoard() {
    setShowEditBoardModal(true);
  }

  async function handleDeleteCurrentBoard() {
    const response = deleteData(API_URLS.deleteBoard, board!);

    toast.promise(response, {
      loading: "Sending...",
      success: `Your board has been deleted`,
      error: (err) => `Could not delete your board: ${err.toString()}`,
    });

    await response;

    if (hasError) {
      throw new Error("Something went wrong.");
    }

    setShowDeletionWarning(false);
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
      <header
        className={`flex ${
          isMobile ? "h-[6.4rem]" : "h-[9.6rem]"
        } max-w-[100%] items-center justify-start border-b border-lines-light bg-white pr-[2.2rem] pl-[2.4rem] dark:border-lines-dark dark:bg-grey-dark`}
      >
        {!showSidebar && !isMobile && (
          <div className="flex h-full items-center border-r-[0.1rem] border-lines-light pr-[3.2rem] dark:border-lines-dark">
            <Image
              src={theme === "dark" ? LogoDarkMode : LogoLightMode}
              alt="kanban-logo"
            />
          </div>
        )}
        {isMobile && (
          <div className="mr-[1.6rem]">
            <Image src={LogoMobile} alt="kanban-logo" />
          </div>
        )}
        <h1
          className={`font-bold ${isMobile ? "text-xl" : "text-2xl"} ${
            !showSidebar && !isMobile && "ml-[3.2rem]"
          }`}
        >
          {activeBoard?.name || ""}
        </h1>
        <div className="relative ml-auto flex gap-[1rem]">
          {boardDataStatus === STATUS.SUCCESS ? (
            <Button
              large
              variant="primary"
              additionalClassNames={isMobile ? "py-[1rem] px-[1.8rem]" : ""}
              onClick={onAddNewTask}
              disabled={!columnsExist}
            >
              {isMobile ? <Image src={AddIcon} alt="add" /> : "+Add New Task"}
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
