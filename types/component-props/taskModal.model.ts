import { IColumn, ISubtask, ITask } from "../data/board.model";

export type TaskModalProps = {
  statusOptions: IColumn[];
  task?: ITask;
  onClose: VoidFunction;
  subtaskList?: ISubtask[];
};
