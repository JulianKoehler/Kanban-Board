import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface BoardsState {
  activeBoard: Omit<BoardListItem, "createdAt"> | undefined;
}

const initialState: BoardsState = {
  activeBoard: undefined,
};

export const boardSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    setActiveBoard: (
      state,
      action: PayloadAction<Omit<BoardListItem, "createdAt"> | undefined>
    ) => {
      state.activeBoard = action.payload;
    },
  },
});

export const { setActiveBoard } = boardSlice.actions;

export const selectActiveBoard = (state: RootState) => state.boards.activeBoard;

export default boardSlice.reducer;
