import { configureStore } from "@reduxjs/toolkit";
import boardsReducer from "./slices/boardSlice";
import authReducer from "./slices/authSlice";
import { boardApi } from "@/redux/slices/apiSlice";

export const store = configureStore({
  reducer: {
    boards: boardsReducer,
    auth: authReducer,
    [boardApi.reducerPath]: boardApi.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(boardApi.middleware);
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
