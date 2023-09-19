import { IBoard } from "../data/board.model";

export type BoardModalProps = {
  onClose: VoidFunction;
  showModal: boolean;
  board?: IBoard;
};
