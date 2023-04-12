import Head from "next/head";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import BoardManager from "@/components/Sidebar/BoardManager";
import Board from "@/components/Board";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectActiveBoard,
  getActiveBoardData,
  selectError,
} from "@/redux/slices/boardSlice";
import toast, { Toaster } from "react-hot-toast";

export default function Kanban() {
  const dispatch = useAppDispatch();
  const { theme, systemTheme, setTheme } = useTheme();
  const [appIsMounted, setAppIsMounted] = useState(false);
  const activeBoard = useAppSelector(selectActiveBoard);
  const error = useAppSelector(selectError);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    if (error === undefined) {
      dispatch(
        getActiveBoardData({
          id: activeBoard?.id ?? "",
          signal,
        })
      );
    }

    return () => {
      controller.abort();
    };
  }, [activeBoard]);

  /* Avoid hydration mismatch */
  useEffect(() => {
    setAppIsMounted(true);
  }, []);

  if (!appIsMounted) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;

  function handleThemeChange() {
    setTheme(currentTheme === "dark" ? "light" : "dark");
  }

  return (
    <>
      <Head>
        <title>Kanban</title>
        <meta
          name="description"
          content="Your kanban app that supports your agile workflow!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Sidebar
        theme={currentTheme!}
        setTheme={handleThemeChange}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        boardManager={<BoardManager />}
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
        <Header showSidebar={showSidebar} theme={currentTheme!} />
        <Board />
      </div>
    </>
  );
}
