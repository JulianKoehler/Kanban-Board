import React, { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {}

const TextInput = ({ ...rest }: Props) => {
  return (
    <input
      {...rest}
      className="w-full rounded-[0.4rem] border-[0.1rem] border-[#828fa340] px-[1.6rem] py-[0.8rem] text-base focus:border-purple-main focus:outline-none"
      type="text"
    />
  );
};

export default TextInput;
