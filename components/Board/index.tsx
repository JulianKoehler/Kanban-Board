import { IBoard } from "@/types/data";
import Button from "../UI/Button";
import Column from "./Column";
import Task from "./Task";

type Props = {
  data: IBoard | null;
};

const Board = ({ data }: Props) => {
  console.log(data);

  return (
    <main
      className={`relative flex h-[calc(100vh-9.6rem)] gap-[2.4rem] overflow-auto bg-grey-light pl-[2.4rem] pt-[2.4rem] pb-40 dark:bg-grey-very-dark`}
    >
      {data?.columns?.map((column, index) => (
        <Column column={column} index={index}>
          {column.tasks?.map((task, index) => (
            <Task data={data} task={task} index={index} />
          ))}
        </Column>
      ))}
      {data?.columns?.length! >= 1 ? (
        <div className="mt-[4rem] flex min-w-[28rem] cursor-pointer items-center justify-center rounded-[0.6rem] bg-gradient-to-b from-[#E9EFFA] to-[#e9effa80] text-2xl font-bold text-grey-medium hover:text-purple-main dark:from-[#2b2c3740] dark:to-[#2b2c3721]">
          + New Column
        </div>
      ) : (
        <div className="m-auto flex flex-col items-center justify-between gap-[4.7rem]">
          <p className="font-xl font-bold text-grey-medium">
            {data
              ? "This board is empty. Create a new column to get started."
              : "You don't have any boards. Create one to get started."}
          </p>
          <Button variant="primary" large>
            {data ? "+ Add New Column" : "+ Create New Board"}
          </Button>
        </div>
      )}
    </main>
  );
};

export default Board;
