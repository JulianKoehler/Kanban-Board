import React from "react";

type Props = {
  additionalClassNames?: string;
  show: boolean;
  children: React.ReactNode;
};

export type RefDiv = HTMLDivElement;

const DropDownContainer = React.forwardRef<RefDiv, Props>(
  ({ children, additionalClassNames = "", show }, ref) => {    
    return (
      <div
        ref={ref}
        className={`z-10 absolute transition-all flex h-fit w-fit min-w-[19.2rem] flex-col rounded-xl bg-white p-0 shadow-sm dark:bg-grey-very-dark ${show ? "opacity-1 translate-y-2" : "opacity-0 -translate-y-2 pointer-events-none"} ${additionalClassNames}`}
      >
        {children}
      </div>
    );
  }
);

export default DropDownContainer;
