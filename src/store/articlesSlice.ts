import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Article, articles} from "../api/articleAPI";

export type SoftOrder = 'newest'|'oldest';
interface SearchResult {
    keywords: string;
    category: string;
    sortBy: SoftOrder;
    results: Article[];
}
const initialState: SearchResult = {
    keywords:'',
    category:'all',
    sortBy:'newest',
    results: articles,
}
function filterArticle(keywords: string, category: string, sortBy: SoftOrder) {
    const cleanKeywords = keywords.trim().toLowerCase();
    const cleanCategory = category.trim().toLowerCase();
    const filter = articles.filter(article => {
        const matchKeywords = !cleanKeywords||article.title.toLowerCase().includes(cleanKeywords)||article.description.toLowerCase().includes(cleanKeywords);
        const matchCategory = cleanCategory === 'all'|| (article.category||'').toLowerCase() === cleanCategory;
        return matchKeywords && matchCategory;
    });
    return [...filter].sort((a, b) =>{
        const timeA = new Date(a.date).getTime()||0;
        const timeB = new Date(b.date).getTime()||0;
        return sortBy === 'newest' ? timeB - timeA : timeA - timeB;
    })
}
const searchSlice = createSlice({
    name:'search',
    initialState,
    reducers:{
        executeSearch: (
            state,
            action: PayloadAction<{ keywords?: string; category?: string; sortBy?: SoftOrder}>
        ) => {
            if (action.payload.keywords !== undefined) {
                state.keywords = action.payload.keywords;
            }
            if (action.payload.category !== undefined) {
                state.category = action.payload.category;
            }
            if (action.payload.sortBy !== undefined) {
                state.sortBy = action.payload.sortBy;
            }
        },
        resetSearch: (state: SearchResult) => {
            state.keywords = '';
            state.category = 'all';
            state.sortBy = 'newest';
            state.results = articles;
        }
    }
})
export const {executeSearch, resetSearch} = searchSlice.actions;
export default searchSlice.reducer;