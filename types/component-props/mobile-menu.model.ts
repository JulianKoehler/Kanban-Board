import { ChangeEventHandler } from "react";

export type MobileMenuProps = {
  children: React.ReactNode;
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>> &
    ChangeEventHandler<HTMLInputElement>;
  onClose: VoidFunction;
};
