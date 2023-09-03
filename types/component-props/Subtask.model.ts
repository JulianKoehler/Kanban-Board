import { ISubtask } from "../data/board.model";

export type SubtaskProps = {
  checked: boolean;
  id: string;
  index: number;
  title: string;
  taskId: string;
  markedForDeletion: boolean;
  updateSubtask: (updatedSubtask: ISubtask) => void;
};
