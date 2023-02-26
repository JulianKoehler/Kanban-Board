import Head from "next/head";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { KanbanData } from "@/types/data";
import Header from "@/components/Header";
import BoardManager from "@/components/Sidebar/BoardManager";
import { getData } from "@/util/http";

interface Props {
  initialData: KanbanData;
}

export default function Kanban({ initialData }: Props) {
  const { theme, systemTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeBoard, setActiveBoard] = useState(initialData[0]);

  /* Avoid hydration mismatch */
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;

  function handleThemeChange() {
    setTheme(currentTheme === "dark" ? "light" : "dark");
  }

  console.log(initialData);

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
        boardManager={
          <BoardManager
            initialData={initialData}
            activeBoard={activeBoard}
            setActiveBoard={setActiveBoard}
          />
        }
      />
      <div>
        <Header boardName={activeBoard.name} />
        <h1 className="text-3xl text-center">Hello World!</h1>
        {JSON.stringify(activeBoard)}
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
