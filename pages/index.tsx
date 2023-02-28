import Head from "next/head";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { KanbanData } from "@/types/data";
import Header from "@/components/Header";
import BoardManager from "@/components/Sidebar/BoardManager";
import { getData } from "@/util/http";
import Board from "@/components/Board";

interface Props {
  initialData: KanbanData;
}

export default function Kanban({ initialData }: Props) {
  const { theme, systemTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeBoard, setActiveBoard] = useState(initialData[0]);
  const [showSidebar, setShowSidebar] = useState(true);

  /* Avoid hydration mismatch */
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

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
            initialData={initialData}
            activeBoard={activeBoard}
            setActiveBoard={setActiveBoard}
          />
        }
      />
      <div className="w-full">
        <Header board={activeBoard} />
        <Board
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
          data={activeBoard}
        />
      </div>
    </>
  );
}

export async function getStaticProps() {
  const data = await getData(
    "https://kanban-9a84a-default-rtdb.europe-west1.firebasedatabase.app/boards.json"
  );

  return {
    props: {
      initialData: data,
    },
  };
}
