import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { IBoard } from "../data/board.model";
import { SerializedError } from "@reduxjs/toolkit";

export type BoardDataProps = {
  isSuccessBoardList: boolean;
  errorBoardList: FetchBaseQueryError | SerializedError | undefined;
};
