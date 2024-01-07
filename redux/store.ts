import { configureStore } from '@reduxjs/toolkit';
import boardsReducer from './slices/boardSlice';
import authReducer from './slices/authSlice';
import { api } from './api/api';

export const store = configureStore({
    reducer: {
        boards: boardsReducer,
        auth: authReducer,
        [api.reducerPath]: api.reducer,
    },
    middleware: getDefaultMiddleware => {
        return getDefaultMiddleware().concat(api.middleware);
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
