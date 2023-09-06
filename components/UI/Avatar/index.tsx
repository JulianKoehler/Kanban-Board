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
    let userName = "";
    const MAX_LENGTH_INITIALS = 3

    if (!userNameArray) return;

    for (let i = 0; i < userNameArray.length; i++) {
      if (i >= MAX_LENGTH_INITIALS) break
      userName += userNameArray[i].charAt(0);
    }

    return userName;
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
