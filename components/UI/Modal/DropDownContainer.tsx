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
        className={`z-10 flex h-fit w-fit min-w-[19.2rem] flex-col rounded-xl bg-white p-0 shadow-sm dark:bg-grey-very-dark ${additionalClassNames}`}
      >
        {children}
      </div>
    );
  }
);

export default DropDownContainer;
