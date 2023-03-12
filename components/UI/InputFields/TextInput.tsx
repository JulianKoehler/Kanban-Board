import React, { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  additionalClasses?: string;
}

const TextInput = React.forwardRef<HTMLInputElement, Props>(
  ({ additionalClasses = "", ...rest }, ref) => {
    return (
      <input
        {...rest}
        ref={ref}
        className={`w-full rounded-[0.4rem] border-[0.1rem] border-[#828fa340] bg-white px-[1.6rem] py-[0.8rem] text-base invalid:border-red  focus:border-purple-main focus:outline-none dark:bg-grey-dark ${additionalClasses}`}
        type="text"
      />
    );
  }
);

export default TextInput;
