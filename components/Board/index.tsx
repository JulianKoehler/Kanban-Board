import { IBoard } from "@/types/data";
import Column from "./Column";
import Task from "./Task";

type Props = {
  data: IBoard;
};

const Board = ({ data }: Props) => {
  return (
    <main
      className={`relative flex h-[calc(100vh-9.6rem)] w-full gap-[2.4rem] overflow-auto bg-grey-light pl-[2.4rem] pt-[2.4rem] pb-40 dark:bg-grey-very-dark`}
    >
      {data.columns.map((column, index) => (
        <Column column={column} index={index}>
          {column.tasks?.map((task, index) => (
            <Task data={data} task={task} index={index} />
          ))}
        </Column>
      ))}
      <div className="mt-[4rem] flex w-[28rem] cursor-pointer items-center justify-center rounded-[0.6rem] bg-gradient-to-b from-[#E9EFFA] to-[#e9effa80] text-2xl font-bold text-grey-medium hover:text-purple-main dark:from-[#2b2c3740] dark:to-[#2b2c3721]">
        + New Column
      </div>
    </main>
  );
};

export default Board;
