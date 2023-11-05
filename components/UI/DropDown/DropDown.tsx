import DropDownContainer from "@/components/UI/DropDown/DropDownContainer";
import useMenuHandler from "@/hooks/useMenuHandler";
import { IColumn } from "@/types/data/board.model";
import { cn } from "@/util/combineStyles";
import { useEffect, useRef, useState } from "react";

type Props = {
  currentOption?: string;
  dropDownOptions: IColumn[];
  onStatusChange: (column: IColumn) => void;
};

const DropDown = ({ currentOption, dropDownOptions, onStatusChange }: Props) => {
  const dropDownRef = useRef<HTMLDivElement>(null);
  const bottomContainer = useRef<HTMLDivElement>(null);
  const { 
    showElement: showDropDown, 
    setShowElement: setShowDropDown,
  } = useMenuHandler(dropDownRef);
  const [displayedStatus, setDisplayedStatus] = useState(
    currentOption || dropDownOptions[0].name
  );

  function handleSelectOption(selectedColumn: IColumn) {
    onStatusChange!(selectedColumn);
    setDisplayedStatus(selectedColumn.name);
    setShowDropDown(false);
  }

  useEffect(() => {
    bottomContainer.current?.scrollIntoView({ behavior: "smooth" })
  }, [showDropDown])

  return (
    <div role="select" className="max-w-full relative" ref={dropDownRef}>
      <button
        type="button"
        onClick={() => setShowDropDown((prevState) => !prevState)}
        className="flex w-full items-center justify-between rounded-md border-[0.1rem] border-lines-light py-[0.8rem] px-[1.6rem] hover:border-purple-main"
      >
        <p className="max-w-[23rem] overflow-hidden text-ellipsis whitespace-nowrap text-base font-medium tablet:max-w-[37rem]">
          {displayedStatus}
        </p>
        <div className="h-4 w-[1.2rem] bg-dropDownArrowDown bg-contain bg-center bg-no-repeat" />
      </button>
      <DropDownContainer
        show={showDropDown}
        additionalClassNames={`w-full max-w-[42rem] rounded-none rounded-b-xl`}
      >
        {dropDownOptions.map((status, index) => (
          <p
            key={status.id}
            role="option"
            onClick={() => handleSelectOption(status)}
            className={cn(index === dropDownOptions.length - 1 ? "rounded-b-xl" : "", "max-w-full overflow-hidden text-ellipsis whitespace-nowrap px-[1.6rem] py-[0.8rem] text-left text-base font-medium text-grey-medium hover:bg-slate-100 dark:hover:bg-slate-800")}
          >
            {status.name}
          </p>
        ))}
        <div ref={bottomContainer} className={cn(!showDropDown && "hidden")} />
      </DropDownContainer>
    </div>
  );
};

export default DropDown;
