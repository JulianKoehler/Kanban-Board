import { IBoard, ITask } from "../data/board.model";

export type DeletionPayload = {
  id: ITask["id"],
  column: ITask["column"],
  boardId: IBoard["id"],
};
