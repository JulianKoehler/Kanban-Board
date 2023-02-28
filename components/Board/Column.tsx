import { IColumn } from "@/types/data";
import React from "react";

type Props = {
  children?: React.ReactNode;
  column: IColumn;
  index: number;
};

const Column = ({ column, index, children }: Props) => {
  function getDotColor() {
    switch (index) {
      case 0:
        return "bg-[#49C4E5]";
      case 1:
        return "bg-[#8471F2]";
      case 2:
        return "bg-[#67E2AE]";
      default:
        return "bg-[#67E2AE]";
    }
  }

  return (
    <div className="h-fit min-w-[28rem]">
      <h4 className="mb-[2.4rem] text-sm font-bold tracking-wide text-grey-medium">
        <div
          className={`${getDotColor()} mr-5 inline-block h-6 w-6 rounded-full bg-[#49C4E5] align-middle`}
        />
        {column.name}({column?.tasks?.length || 0})
      </h4>
      <div className="flex flex-col gap-8">{children}</div>
    </div>
  );
};

export default Column;
