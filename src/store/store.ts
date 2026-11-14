import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import searchReducer from './articlesSlice'
import newsReducer from './newsSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        search : searchReducer,
        news: newsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;