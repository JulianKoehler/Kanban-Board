import { StageCreate, StageResponse, StageUpdate } from "./stages";

export interface BoardBase {
  title: string;
}

export interface BoardListItem extends BoardBase {
  id: string;
  createdAt: string;
}

export interface BoardCreate extends BoardBase {
  stages: StageCreate[];
}

export interface BoardUpdate extends BoardBase {
  stages: StageUpdate[];
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
}
