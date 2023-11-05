import Head from "next/head";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import BoardManager from "@/components/Sidebar/BoardManager";
import Board from "@/components/Board";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Toaster } from "react-hot-toast";
import { auth } from "@/firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useGetBoardListQuery } from "@/redux/slices/apiSlice";
import { selectActiveBoard } from "@/redux/slices/boardSlice";
import BoardList from "@/components/Sidebar/BoardManager/BoardList";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { login } from "@/redux/slices/authSlice";
import { SkeletonTheme } from "react-loading-skeleton";

export default function Kanban() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [user, loadingUser] = useAuthState(auth);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [appIsMounted, setAppIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean | undefined>();
  const activeBoard = useAppSelector(selectActiveBoard);

  const { theme, systemTheme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const skeletonBaseColor = theme === "dark" ? "#1f1d24" : "#dbdbdb";
  const skeletonHighlightColor = theme === "dark" ? "#2c2d33": "#c2c2c2"

  console.log("User: ", user);
  console.log("active board: ", activeBoard);

  const {
    data: boardList,
    isFetching: isLoadingBoardList,
    error: errorBoardList,
    isSuccess: isSuccessBoardList,
    refetch: refetchBoardList,
  } = useGetBoardListQuery(user?.uid ? user?.uid : skipToken);

  useEffect(() => {
    const serializedUser = JSON.parse(JSON.stringify(user));
    !user && !loadingUser && router.replace("/login");
    user && dispatch(login(serializedUser)) && refetchBoardList();
  }, [user, loadingUser]);

  useEffect(() => {
    setAppIsMounted(true);
  }, []);

  if (!appIsMounted) return null;


  function handleThemeChange() {
    setTheme(currentTheme === "dark" ? "light" : "dark");
  }

  function onToggleMobileMenu() {
    setShowMobileMenu((bool) => !bool);
  }

  return (
    <>
      <Head>
        <title>{activeBoard?.name || "Your Kanban Task Manager"}</title>
        <meta
          name="description"
          content="Your kanban app that supports your agile workflow."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SkeletonTheme baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor}>
        <Sidebar
          theme={currentTheme!}
          setTheme={handleThemeChange}
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
          boardManager={
            <BoardManager
              boardListLength={boardList?.length ?? 0}
              isLoading={isLoadingBoardList}
            >
              <BoardList
                boardList={boardList}
                refetchBoardList={refetchBoardList}
                onMobileClose={() => null}
              />
            </BoardManager>
          }
        />
        <div className="w-full overflow-hidden">
          <div>
            <Toaster
              toastOptions={{
                style: {
                  borderRadius: "4rem",
                  background: theme === "dark" ? "#2B2C37" : "#F4F7FD",
                  color: theme === "dark" ? "white" : "black",
                },
              }}
            />
          </div>
          <Header
            showSidebar={showSidebar}
            theme={currentTheme!}
            setTheme={handleThemeChange}
            onToggleMobileMenu={onToggleMobileMenu}
            showMobileMenu={showMobileMenu}
            setIsMobile={(isMobile: boolean) => setIsMobile(isMobile)}
            boardList={boardList}
            isLoadingBoardList={isLoadingBoardList}
            isSuccessBoardList={isSuccessBoardList}
          >
            {isMobile && (
              <BoardManager
                boardListLength={boardList?.length ?? 0}
                isLoading={isLoadingBoardList}
              >
                <BoardList
                  boardList={boardList}
                  refetchBoardList={refetchBoardList}
                  onMobileClose={onToggleMobileMenu}
                />
              </BoardManager>
            )}
          </Header>
          <Board
            key={activeBoard?.id}
            isSuccessBoardList={isSuccessBoardList}
            errorBoardList={errorBoardList}
          />
        </div>
      </SkeletonTheme>
    </>
  );
}
