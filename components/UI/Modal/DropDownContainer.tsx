import React from "react";

type Props = {
  additionalClassNames?: string;
  children: React.ReactNode;
};

export type Ref = HTMLDivElement;

const DropDownContainer = React.forwardRef<Ref, Props>(
  ({ children, additionalClassNames = "" }, ref) => {
    return (
      <div
        ref={ref}
        className={`z-10 flex h-fit w-fit flex-col rounded-xl bg-white p-0 shadow-sm dark:bg-grey-very-dark desktop:min-w-[41.6rem] ${additionalClassNames}`}
      >
        {children}
      </div>
    );
  }
);

export default DropDownContainer;
