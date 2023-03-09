import Head from "next/head";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { IBoard } from "@/types/data";
import Header from "@/components/Header";
import BoardManager from "@/components/Sidebar/BoardManager";
import Board from "@/components/Board";
import axios from "axios";

interface Props {
  ssgData: {
    allBoardsData: {
      boards: Array<{
        id: string;
        name: string;
      }>;
    };
    firstBoardData: IBoard;
  };
  error?: Error;
}

export default function Kanban({ ssgData, error }: Props) {
  const { theme, systemTheme, setTheme } = useTheme();
  const [appIsMounted, setAppIsMounted] = useState(false);
  const [activeBoard, setActiveBoard] = useState<IBoard | null>(
    ssgData?.allBoardsData.boards[0] ?? null
  );
  const [boardData, setBoardData] = useState<IBoard | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(error ?? false);

  useEffect(() => {
    (async function getData() {
      setIsLoading(true);
      try {
        const { data } = await axios.get(
          `http://localhost:3000/api/getBoard/${activeBoard?.id}`
        );
        setBoardData(data.board);
        setIsLoading(false);
        setHasError(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        setHasError(false);
      }
    })();
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
        boardManager={
          <BoardManager
            initialData={ssgData?.allBoardsData.boards ?? []}
            activeBoard={activeBoard || null}
            setActiveBoard={setActiveBoard}
          />
        }
      />
      <div className="w-full overflow-hidden">
        <Header
          showSidebar={showSidebar}
          theme={currentTheme!}
          board={boardData}
          boardName={activeBoard?.name || ""}
        />
        <Board
          boardData={boardData}
          currentBoard={activeBoard || null}
          isLoading={isLoading}
          hasError={hasError}
        />
      </div>
    </>
  );
}

export async function getStaticProps() {
  try {
    const allBoardsResponse = await fetch(
      "http://localhost:3000/api/getBoard/all"
    );
    const allBoardsData = await allBoardsResponse.json();
    const firstBoardId = allBoardsData.boards[0].id;

    const firstBoardResponse = await fetch(
      `http://localhost:3000/api/getBoard/${firstBoardId}`
    );
    const firstBoardData = await firstBoardResponse.json();

    const data = {
      allBoardsData,
      firstBoardData,
    };

    return {
      props: {
        ssgData: data,
      },
    };
  } catch (err) {
    console.error(err);

    return {
      props: {
        initialData: null,
        error: true,
      },
    };
  }
}
