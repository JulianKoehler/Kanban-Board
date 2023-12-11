export type Subtask = {
    title: string;
    index: number;
    is_completed: boolean;
    id: string;
    markedForDeletion?: boolean;
    isNew?: boolean;
};
