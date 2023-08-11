import { cn } from "@/util/combineStyles";
import { User } from "firebase/auth";
import React, { HTMLProps } from "react";

interface Props extends HTMLProps<HTMLDivElement> {
  user: User;
  className?: HTMLProps<HTMLElement>["className"];
  [props: string]: any;
}

const Avatar = ({ user, className = "", ...props }: Props) => {
  const userNameArray = user?.displayName?.split(" ");

  function getUserInitials() {
    return userNameArray
      ? userNameArray![0].charAt(0).concat(userNameArray![1].charAt(0))
      : "";
  }

  return (
    <div
      className={cn(
        "flex h-[4rem] w-[4rem] cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500 font-bold tracking-[0.08rem] text-white",
        className
      )}
      {...props}
    >
      {getUserInitials()}
    </div>
  );
};

export default Avatar;
