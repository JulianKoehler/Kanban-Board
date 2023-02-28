import React from "react";

type Props = {
  additionalClassNames?: string;
  handleEdit: VoidFunction;
  handleDelete: VoidFunction;
};

export type Ref = HTMLDivElement;

const ThreeDotsModalContainer = React.forwardRef<Ref, Props>(
  ({ additionalClassNames = "", handleEdit, handleDelete }, ref) => {
    return (
      <div
        ref={ref}
        className={`z-10 flex h-fit w-fit min-w-[19.2rem] flex-col rounded-xl bg-white p-0 shadow-sm dark:bg-grey-very-dark ${additionalClassNames}`}
      >
        <button
          onClick={handleEdit}
          className="w-full rounded-t-xl px-[1.6rem] pt-[1.6rem] pb-[0.8rem] text-left text-base font-medium text-grey-medium hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          Edit Board
        </button>
        <button
          onClick={handleDelete}
          className="rounded-b-xl px-[1.6rem] pt-[0.8rem] pb-[1.6rem] text-left text-base font-medium text-red hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          Delete Board
        </button>
      </div>
    );
  }
);

export default ThreeDotsModalContainer;
