export type KanbanData = Board[];

export interface Board {
  id: number;
  name: string;
  columns: Column[];
}

export interface Column {
  //   id: number;
  name: string;
  tasks: Task[];
}

export interface Task {
  //   id: number;
  title: string;
  details: string;
  status: Array<Column["name"]>;
  subtasks: Subtask[];
}

export interface Subtask {
  //   id: number;
  title: string;
  isCompleted: boolean;
}
