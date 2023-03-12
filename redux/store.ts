import { configureStore } from "@reduxjs/toolkit";
import allBoardsReducer from "./slices/allBoardsSlice";
import activeBoardReducer from "./slices/activeBoardSlice";

export const store = configureStore({
  reducer: {
    allBoards: allBoardsReducer,
    activeBoard: activeBoardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
