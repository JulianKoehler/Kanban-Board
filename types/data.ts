export type KanbanData = IBoard[];

export interface IBoard {
  id: number;
  name: string;
  columns: IColumn[];
}

export interface IColumn {
  //   id: number;
  name: string;
  tasks: ITask[];
}

export interface ITask {
  //   id: number;
  title: string;
  details: string;
  status: Array<IColumn["name"]>;
  subtasks: Subtask[];
}

export interface Subtask {
  //   id: number;
  title: string;
  isCompleted: boolean;
}
