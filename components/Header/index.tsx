import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { selectActiveBoard } from "@/redux/slices/boardSlice";
import Image from "next/image";
import LogoLightMode from "@/public/assets/logo-dark.svg";
import LogoDarkMode from "@/public/assets/logo-light.svg";
import LogoMobile from "@/public/assets/logo-mobile.svg";
import AddIcon from "@/public/assets/icon-add-task-mobile.svg";
import ArrowDown from "@/public/assets/icon-chevron-down.svg";
import ArrowUp from "@/public/assets/icon-chevron-up.svg";
import Button from "@/components/UI/Button";
import TaskModal from "../Board/Task/TaskModal";
import useViewport from "@/hooks/useViewport";
import MobileMenu from "./MobileMenu";
import { HeaderProps } from "@/types/component-props/header.model";
import UserMenu from "../User/UserMenu";
import BoardMenu from "../Board/BoardMenu";
import { selectUser } from "@/redux/slices/authSlice";
import { useGetBoardDataQuery } from "@/redux/slices/apiSlice";
import { skipToken } from "@reduxjs/toolkit/dist/query";

const Header = ({
  children,
  showSidebar,
  showMobileMenu,
  onToggleMobileMenu,
  theme,
  setTheme,
  setIsMobile,
  isSuccessBoardList,
}: HeaderProps) => {
  const activeBoard = useAppSelector(selectActiveBoard);
  const { data: board, isFetching: isFetchingBoardData } = useGetBoardDataQuery(
    activeBoard?.id ? activeBoard?.id : skipToken
  );
  const user = useAppSelector(selectUser);
  const [showAddNewTaskModal, setShowAddNewTaskModal] = useState(false);
  const columnsExist = board?.columns && board?.columns?.length > 0;
  const [isMobile, isTablet] = useViewport();
  const maxLengthBoardName = 30;

  useEffect(() => {
    setIsMobile(isMobile);
  }, [isMobile]);

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
            onClick={onToggleMobileMenu}
          >
            <Image
              src={showMobileMenu ? ArrowUp : ArrowDown}
              alt="Open board manager"
            />
          </button>
        )}
        <div className="relative ml-auto flex min-w-fit items-center gap-[1rem]">
          {isSuccessBoardList && activeBoard ? (
            <Button
              large
              variant="primary"
              className={isMobile ? "py-[1rem] px-[1.8rem]" : "px-[2.4rem]"}
              onClick={onAddNewTask}
              disabled={!columnsExist || isFetchingBoardData}
            >
              {isMobile ? <Image src={AddIcon} alt="add" /> : "+Add New Task"}
            </Button>
          ) : null}
          {isSuccessBoardList && activeBoard && !isFetchingBoardData && (
            <BoardMenu />
          )}
          {user && <UserMenu />}
        </div>
      </header>
      <TaskModal
        key={board?.id}
        showModal={showAddNewTaskModal}
        statusOptions={board?.columns!}
        onClose={onCloseNewTask}
      />

      <MobileMenu
        showModal={isMobile && showMobileMenu}
        theme={theme}
        setTheme={setTheme}
        onClose={onToggleMobileMenu}
      >
        {children}
      </MobileMenu>
    </>
  );
};

export default Header;
