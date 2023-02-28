import React from "react";

type Props = {
  checked: boolean;
  id: string;
  title: string;
};

const Subtask = ({ checked, id, title }: Props) => {
  return (
    <div
      className={`flex w-[41.6rem] cursor-pointer items-center rounded-md bg-grey-light p-[1.2rem] dark:bg-grey-dark ${
        !checked && "hover:bg-[#635fc740] dark:hover:bg-[#635fc740]"
      }`}
    >
      <input
        id={id}
        className="absolute cursor-pointer opacity-0"
        checked={checked}
        type="checkbox"
      />
      <label
        className={`flex cursor-pointer items-center text-sm font-bold ${
          checked
            ? "text-grey-medium line-through decoration-lines-light decoration-[0.1rem] before:bg-purple-main before:bg-checkIcon before:bg-center before:bg-no-repeat dark:decoration-lines-dark dark:before:bg-purple-main"
            : ""
        } before:mr-[1.6rem] before:h-[1.6rem] before:min-w-[1.6rem] before:rounded before:border-[0.1rem] before:border-[#828fa333]  before:content-['']  ${
          !checked && "before:bg-white before:dark:bg-grey-dark"
        }`}
        htmlFor={id}
      >
        {title}
      </label>
    </div>
  );
};

export default Subtask;
