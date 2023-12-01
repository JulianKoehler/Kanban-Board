interface SubtaskCreate {
    title: string;
    index: number;
    is_completed: boolean;
}

interface SubtaskUpdate extends SubtaskCreate {
    id: string;
    markedForDeletion?: boolean;
}

interface SubtaskResponse extends SubtaskUpdate {}
