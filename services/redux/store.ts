import { configureStore } from '@reduxjs/toolkit';
import { api } from './api/api';
import authReducer from './slices/authSlice';
import boardsReducer from './slices/boardSlice';

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
