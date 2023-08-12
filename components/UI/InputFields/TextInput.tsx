import { cn } from "@/util/combineStyles";
import React, { HTMLProps, InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  className?: HTMLProps<HTMLElement>["className"];
}

const Input = React.forwardRef<HTMLInputElement, Props>(
  ({ className = "", ...rest }, ref) => {
    return (
      <input
        type="text"
        {...rest}
        ref={ref}
        className={cn(
          "w-full rounded-[0.4rem] border-[0.1rem] border-[#828fa340] bg-white px-[1.6rem] py-[0.8rem] text-base invalid:border-red  focus:border-purple-main focus:outline-none dark:bg-grey-dark",
          className
        )}
      />
    );
  }
);

export default Input;
