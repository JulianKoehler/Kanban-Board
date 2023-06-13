import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

const AuthCard = ({ children, className }: Props) => {
  return (
    <div
      className={`absolute top-[50%] left-[50%] flex w-[64rem] translate-y-[-50%] translate-x-[-50%] rounded-[3.4rem] bg-[#ffffff] p-24 shadow-md-light ${className}`}
    >
      {children}
    </div>
  );
};

export default AuthCard;
