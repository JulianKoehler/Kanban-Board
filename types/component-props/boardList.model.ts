import { QueryActionCreatorResult } from "@reduxjs/toolkit/dist/query/core/buildInitiate";
import { BoardListItem } from "../data/board.model";
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  QueryDefinition,
} from "@reduxjs/toolkit/dist/query";

export type BoardListProps = {
  boardList: BoardListItem[] | undefined;
  onMobileClose: () => void;
  refetchBoardList: () => QueryActionCreatorResult<
    QueryDefinition<
      string,
      BaseQueryFn<
        string | FetchArgs,
        unknown,
        FetchBaseQueryError,
        {},
        FetchBaseQueryMeta
      >,
      "BoardList" | "BoardData",
      BoardListItem[],
      "board"
    >
  >;
};
