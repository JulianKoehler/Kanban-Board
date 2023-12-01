interface StageBase {
  title: string;
  index: number;
  color: string;
}

interface StageCreate extends StageBase {
  id: string;
  boardId?: string;
}

interface StageUpdate extends StageCreate {
  markedForDeletion?: boolean;
}

interface StageResponse extends StageBase {
  id: string;
  tasks: TaskResponse[];
}

interface Status {
  id: string;
  title: string;
}
