import { cn } from "@/util/combineStyles";
import { User } from "firebase/auth";
import React, { HTMLProps } from "react";

interface Props extends HTMLProps<HTMLDivElement> {
  user: User;
  className?: HTMLProps<HTMLElement>["className"];
  [props: string]: any;
}

const Avatar = ({ user, className = "", ...props }: Props) => {
  function getUserInitials() {
    const userNameArray = user?.displayName?.split(" ");
    return userNameArray
      ? userNameArray![0].charAt(0).concat(userNameArray![1].charAt(0))
      : "";
  }

  return (
    <div
      className={cn(
        "neumorphism tracking-tight flex h-[4rem] w-[4rem] cursor-pointer items-center justify-center rounded-full font-bold text-white",
        className
      )}
      {...props}
    >
      {getUserInitials()}
    </div>
  );
};

export default Avatar;
