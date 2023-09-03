import { ChangeEventHandler } from "react";
import { User } from "firebase/auth";
import { BoardListItem, IBoard } from "../data/board.model";

export type HeaderProps = {
  children?: React.ReactNode;
  showSidebar: boolean;
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>> &
    ChangeEventHandler<HTMLInputElement>;
  setIsMobile: (isMobile: boolean) => void;
  onToggleMobileMenu: () => void;
  showMobileMenu: boolean;
  boardList: BoardListItem[] | undefined;
  isLoadingBoardList: boolean;
  isSuccessBoardList: boolean;
};
