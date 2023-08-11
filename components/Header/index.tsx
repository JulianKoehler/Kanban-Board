import { ChangeEventHandler, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  deleteBoardListItem,
  selectActiveBoard,
  selectactiveBoardData,
  selectBoardDataStatus,
  selectBoardList,
  setActiveBoard,
  setBoardData,
  setBoardList,
  STATUS,
} from "@/redux/slices/boardSlice";
import Image from "next/image";
import LogoLightMode from "@/public/assets/logo-dark.svg";
import LogoDarkMode from "@/public/assets/logo-light.svg";
import LogoMobile from "@/public/assets/logo-mobile.svg";
import AddIcon from "@/public/assets/icon-add-task-mobile.svg";
import ArrowDown from "@/public/assets/icon-chevron-down.svg";
import ArrowUp from "@/public/assets/icon-chevron-up.svg";
import Button from "@/components/UI/Button";
import OptionsIcon from "@/public/assets/icon-vertical-ellipsis.svg";
import DropDownContainer from "@/components/UI/DropDown/DropDownContainer";
import useMenuHandler from "@/hooks/useMenuHandler";
import TaskModal from "../Board/Task/TaskModal";
import BoardModal from "../Board/BoardModal";
import DeletionWarning from "../UI/Modal/DeletionWarning";
import useHttpRequest from "@/hooks/useHttpRequest";
import API_URLS from "@/util/API_URLs";
import useViewport from "@/hooks/useViewport";
import MobileMenu from "./MobileMenu";
import LogoutBtn from "../UI/Button/LogoutBtn";
import { auth } from "@/firebase/config";
import { useDeleteUser, useSignOut } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import localStorageIdentifiers from "@/util/localStorageIdentifiers";
import { User } from "firebase/auth";
import Avatar from "../UI/Avatar";
import { SlLogout } from "react-icons/sl";
import { TiUserDelete } from "react-icons/ti";

type Props = {
  showSidebar: boolean;
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>> &
    ChangeEventHandler<HTMLInputElement>;
  user: User;
};

const Header = ({ showSidebar, theme, setTheme, user }: Props) => {
  const dispatch = useAppDispatch();
  const [signOut, loading, error] = useSignOut(auth);
  const router = useRouter();
  const boardList = useAppSelector(selectBoardList);
  const boardDataStatus = useAppSelector(selectBoardDataStatus);
  const boardMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const board = useAppSelector(selectactiveBoardData);
  const activeBoard = useAppSelector(selectActiveBoard);
  const [showAddNewTaskModal, setShowAddNewTaskModal] = useState(false);
  const [showEditBoardModal, setShowEditBoardModal] = useState(false);
  const [showDeleteBoardWarning, setShowDeleteBoardWarning] = useState(false);
  const [showDeleteAccountWarning, setShowDeleteAccountWarning] =
    useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { showElement: showBoardMenu, setShowElement: setShowBoardMenu } =
    useMenuHandler(boardMenuRef);
  const { showElement: showUserMenu, setShowElement: setShowUserMenu } =
    useMenuHandler(userMenuRef);
  const { isLoading, hasError, deleteData } = useHttpRequest();
  const [deleteUser, loads, err] = useDeleteUser(auth);
  const columnsExist = board?.columns && board?.columns?.length > 0;
  const [isMobile, isTablet] = useViewport();
  const maxLengthBoardName = 30;

  async function handleLogout() {
    await signOut();
    if (!error) {
      localStorage.removeItem(localStorageIdentifiers.activeBoard);
      dispatch(setBoardList([]));
      dispatch(setActiveBoard(undefined));
      dispatch(setBoardData(undefined));
      router.push("/authentication/login");
    } else {
      toast.error("Could not logout: " + error);
    }
  }

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

    setShowDeleteBoardWarning(false);
    dispatch(deleteBoardListItem(board!.id));
    dispatch(setActiveBoard(boardList.length === 1 ? undefined : boardList[0]));
  }

  async function handleAccountDeletion() {
    await deleteUser();
  }

  function onAddNewTask() {
    setShowAddNewTaskModal(true);
  }

  function onCloseNewTask() {
    setShowAddNewTaskModal(false);
  }

  function onShowMobileMenu() {
    setShowMobileMenu((bool) => !bool);
  }

  return (
    <>
      <header
        className={`flex ${
          isMobile ? "h-[6.4rem]" : "h-[9.6rem]"
        } max-w-[100%] items-center justify-start gap-8 border-b border-lines-light bg-white pr-[0.6rem] pl-[1.6rem] dark:border-lines-dark dark:bg-grey-dark tablet:pr-[2.2rem] tablet:pl-[2.4rem]`}
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
          className={`font-bold ${
            isMobile ? "text-xl" : isTablet ? "text-[2rem]" : "text-2xl"
          } ${!showSidebar && !isTablet && !isMobile && "ml-[3.2rem]"} ${
            !showSidebar && isTablet && "ml-[2.4rem]"
          }`}
        >
          {activeBoard?.name.slice(0, maxLengthBoardName) || ""}
          {activeBoard?.name && activeBoard?.name.length > maxLengthBoardName
            ? "..."
            : ""}
        </h1>
        {isMobile && (
          <button
            className={`flex items-center justify-center p-[0.9rem] ${
              showMobileMenu ? "" : "mt-[0.5rem]"
            }`}
            onClick={onShowMobileMenu}
          >
            <Image
              src={showMobileMenu ? ArrowUp : ArrowDown}
              alt="Open board manager"
            />
          </button>
        )}

        <div className="relative ml-auto flex min-w-fit items-center gap-[1rem]">
          {boardDataStatus === STATUS.SUCCESS ? (
            <Button
              large
              variant="primary"
              additionalClassNames={
                isMobile ? "py-[1rem] px-[1.8rem]" : "px-[2.4rem]"
              }
              onClick={onAddNewTask}
              disabled={!columnsExist}
            >
              {isMobile ? <Image src={AddIcon} alt="add" /> : "+Add New Task"}
            </Button>
          ) : null}
          {boardDataStatus === STATUS.SUCCESS && (
            <>
              <button
                onClick={() => setShowBoardMenu((prevState) => !prevState)}
                className="duration 300 rounded-full p-[1rem] transition-all hover:bg-gray-200"
              >
                <Image src={OptionsIcon} alt="options" />
              </button>
              {showBoardMenu && (
                <DropDownContainer
                  additionalClassNames="absolute right-0 top-[6rem]"
                  ref={boardMenuRef}
                >
                  <button
                    onClick={handleEditCurrentBoard}
                    className="w-full rounded-t-xl px-[1.6rem] pt-[1.6rem] pb-[0.8rem] text-left text-base font-medium text-grey-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Edit Board
                  </button>

                  <button
                    onClick={() => setShowDeleteBoardWarning(true)}
                    className="rounded-b-xl px-[1.6rem] pt-[0.8rem] pb-[1.6rem] text-left text-base font-medium text-red hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Delete Board
                  </button>
                </DropDownContainer>
              )}
            </>
          )}
          <Avatar onClick={() => setShowUserMenu(true)} user={user} />
          {showUserMenu && (
            <DropDownContainer
              additionalClassNames="absolute right-0 top-[6rem]"
              ref={userMenuRef}
            >
              <button
                onClick={handleLogout}
                className="flex w-full items-center rounded-t-xl px-[1.6rem] pt-[1.6rem] pb-[0.8rem] text-left text-base font-medium text-grey-medium hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Logout <SlLogout className="ml-3 text-purple-main" />
              </button>
              <button
                onClick={() => setShowDeleteAccountWarning(true)}
                className="flex items-center rounded-b-xl px-[1.6rem] pt-[0.8rem] pb-[1.6rem] text-left text-base font-medium text-red hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Delete Account <TiUserDelete className="ml-3" />
              </button>
            </DropDownContainer>
          )}
        </div>
      </header>
      {showAddNewTaskModal && (
        <TaskModal statusOptions={board?.columns!} onClose={onCloseNewTask} />
      )}
      {showEditBoardModal && (
        <BoardModal
          board={board}
          onClose={() => setShowEditBoardModal(false)}
        />
      )}
      {showDeleteBoardWarning && (
        <DeletionWarning
          title={board?.name ?? ""}
          type="board"
          onClose={() => setShowDeleteBoardWarning(false)}
          deleteFunction={handleDeleteCurrentBoard}
          isLoading={isLoading}
        />
      )}
      {showDeleteAccountWarning && (
        <DeletionWarning
          title={""}
          type="user"
          onClose={() => setShowDeleteAccountWarning(false)}
          deleteFunction={handleAccountDeletion}
          isLoading={loads}
        />
      )}
      {showMobileMenu && isMobile && (
        <MobileMenu
          theme={theme}
          setTheme={setTheme}
          onClose={onShowMobileMenu}
        />
      )}
    </>
  );
};

export default Header;
