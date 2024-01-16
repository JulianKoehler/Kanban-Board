import { StageCreate, StageResponse, StageUpdate } from './stages';
import { UserInfoReturn } from './user';

export interface BoardBase {
    title: string;
}

export interface BoardListItem extends BoardBase {
    id: string;
    createdAt: string;
}

// We only need the IDs of owner and contributors
export interface BoardCreate extends BoardBase {
    stages: StageCreate[];
    owner: string;
    contributors: { id: string; isNew: boolean | undefined; markedForDeletion: boolean | undefined }[];
}

export interface BoardUpdate extends BoardBase {
    stages: StageUpdate[];
    owner: string;
    contributors: { id: string; isNew: boolean | undefined; markedForDeletion: boolean | undefined }[];
}

export interface BoardCreateResponse extends BoardListItem {
    stages: StageResponse[];
}

export interface BoardListResponse {
    own_boards: BoardListItem[];
    contributing: BoardListItem[];
}

export interface BoardDataResponse extends BoardBase {
    id: string;
    stages: StageResponse[];
    owner: UserInfoReturn;
    contributors: UserInfoReturn[];
}
