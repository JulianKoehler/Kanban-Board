import { IBoard } from "../data/board.model";

export type BoardModalProps = {
  onClose: VoidFunction;
  board?: IBoard;
};
