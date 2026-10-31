import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fakePostLoginAPI, User, LoginCredentials, AuthResponse } from '../api/authAPI';

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

export const login = createAsyncThunk(
    "auth/login",
    async (credentials,{rejectWithValue}) => {
        try{
            const res = await fakePostLoginAPI(credentials) as AuthResponse;
            localStorage.setItem("token", res.token);
            return res;
        } catch(err: any) {
            return rejectWithValue(err.message);
        }
    }
)
const authSlice = createSlice({
    name: "authSlice",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
            localStorage.removeItem("token");
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
        }).addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
        }).addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = (action.payload as string)|| action.error.message|| 'Đã xảy ra lỗi đăng nhập';
        })
    }
})

export const {logout, clearError} = authSlice.actions;
export default authSlice.reducer;