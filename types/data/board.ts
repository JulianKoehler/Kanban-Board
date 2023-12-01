interface BoardBase {
  title: string;
}

interface BoardListItem extends BoardBase {
  id: string;
  createdAt: string;
}

interface BoardCreate extends BoardBase {
  stages: StageCreate[];
}

interface BoardUpdate extends BoardBase {
  stages: StageUpdate[];
}

interface BoardCreateResponse extends BoardListItem {
  stages: StageResponse[];
}

interface BoardListResponse {
  own_boards: BoardListItem[];
  contributing: BoardListItem[];
}

interface BoardDataResponse extends BoardBase {
  id: string;
  stages: StageResponse[];
}
