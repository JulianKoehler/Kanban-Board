export type Subtask = {
    title: string;
    index: number;
    is_completed: boolean;
    id: string;
    markedForDeletion?: boolean;
    isNew?: boolean;
};

export type SubtaskResponse = Omit<Subtask, "markedForDeletion" | "isNew"> & {
    task_id: string;
}
