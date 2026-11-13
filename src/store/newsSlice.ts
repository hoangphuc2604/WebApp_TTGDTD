import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface NewsArticle{
    id: string;
    title: string;
    thumbnail: string;
    description: string;
    content: string;
    author: string;
    date: string;
    link: string;
    category: string;
}

interface NewsState {
    articles: NewsArticle[];
    loading: boolean;
}

const initialState: NewsState = {
    articles: [],
    loading: false,
};

export const fetchNews = createAsyncThunk<NewsArticle[]>('news/fetchNews', async () =>{
    const response = await axios.get('http://localhost:5000/api/news');
    return response.data;
});

const newsSlice = createSlice({
    name : 'news',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchNews.pending, state => {
            state.loading = true;
            })
            .addCase(fetchNews.fulfilled, (state, action) => {
                state.loading = false;
                state.articles = action.payload;
            })
            .addCase(fetchNews.rejected, state => {
                state.loading = false;
            })
    }
});

export default newsSlice.reducer;