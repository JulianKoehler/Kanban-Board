import DropDownContainer from "@/components/UI/DropDown/DropDownContainer";
import useMenuHandler from "@/hooks/useMenuHandler";
import { IColumn, ITask } from "@/types/data";
import { useRef, useState } from "react";

type Props = {
  task?: ITask;
  dropDownOptions: Array<IColumn>;
  onStatusChange: (column: IColumn) => void;
};

const DropDown = ({ task, dropDownOptions, onStatusChange }: Props) => {
  const dropDownRef = useRef<HTMLDivElement>(null);
  const { showElement: showDropDown, setShowElement: setShowDropDown } =
    useMenuHandler(dropDownRef);
  const [displayedStatus, setDisplayedStatus] = useState(
    task?.status.name || dropDownOptions[0].name
  );

  async function handleSelectOption(selectedColumn: IColumn) {
    onStatusChange!(selectedColumn);
    setDisplayedStatus(selectedColumn.name);
    setShowDropDown(false);
  }

  return (
    <div role="select">
      <button
        type="button"
        onClick={() => setShowDropDown((prevState) => !prevState)}
        className="flex w-full items-center justify-between rounded-md border-[0.1rem] border-lines-light py-[0.8rem] px-[1.6rem] hover:border-purple-main"
      >
        <p className="text-base font-medium">{displayedStatus}</p>
        <div className="h-4 w-[1.2rem] bg-dropDownArrowDown bg-contain bg-center bg-no-repeat" />
      </button>
      <DropDownContainer
        ref={dropDownRef}
        additionalClassNames={`absolute transition-all duration-300 transition opacity-0 translate-y-[-1rem] desktop:min-w-[41.6rem] rounded-none rounded-b-xl ${
          showDropDown
            ? "opacity-100 translate-y-[0.5rem]"
            : "pointer-events-none"
        }`}
      >
        {dropDownOptions.map((status, index) => (
          <p
            role="option"
            onClick={() => handleSelectOption(status)}
            className={`px-[1.6rem] py-[0.8rem] text-left text-base font-medium text-grey-medium hover:bg-slate-100 dark:hover:bg-slate-800 ${
              index === dropDownOptions.length - 1 ? "rounded-b-xl" : ""
            }`}
          >
            {status.name}
          </p>
        ))}
      </DropDownContainer>
    </div>
  );
};

export default DropDown;
