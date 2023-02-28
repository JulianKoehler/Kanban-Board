import DropDownContainer from "@/components/UI/Modal/DropDownContainer";
import useMenuHandler from "@/hooks/useMenuHandler";
import { IColumn, ITask } from "@/types/data";
import React, { useRef } from "react";

type Props = {
  task: ITask;
  columns: IColumn[];
};

const DropDown = ({ task, columns }: Props) => {
  const dropDownRef = useRef<HTMLDivElement>(null);
  const { showElement: showDropDown, setShowElement: setShowDropDown } =
    useMenuHandler(dropDownRef);

  function handleSelectOption() {
    // Send Request to server that changes the column
    setShowDropDown(false);
  }

  return (
    <div className="flex flex-col gap-[1.6rem]">
      <h4 className="text-sm font-bold text-grey-medium">Current Status</h4>
      <div role="select">
        <button
          onClick={() => setShowDropDown((prevState) => !prevState)}
          className="flex w-full items-center justify-between rounded-md border-[0.1rem] border-lines-light py-[0.8rem] px-[1.6rem] hover:border-purple-main"
        >
          <p className="text-base font-medium">{task.status}</p>
          <div className="h-4 w-[1.2rem] bg-dropDownArrowDown bg-contain bg-center bg-no-repeat" />
        </button>
        <DropDownContainer
          ref={dropDownRef}
          additionalClassNames={`absolute transition-all duration-300 transition w-[86%] opacity-0 translate-y-[-1rem] rounded-none rounded-b-xl ${
            showDropDown
              ? "opacity-100 translate-y-[0.5rem]"
              : "pointer-events-none"
          }`}
        >
          {columns.map((column, index) => (
            <p
              role="option"
              onClick={handleSelectOption}
              className={`px-[1.6rem] py-[0.8rem] text-left text-base font-medium text-grey-medium hover:bg-slate-100 dark:hover:bg-slate-800 ${
                index === columns.length - 1 ? "rounded-b-xl" : ""
              }`}
            >
              {column.name}
            </p>
          ))}
        </DropDownContainer>
      </div>
    </div>
  );
};

export default DropDown;
