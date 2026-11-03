import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fakePostLoginAPI, fakeGetProfileApi, User, LoginCredentials, AuthResponse } from '../api/authAPI';
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

export const login = createAsyncThunk<AuthResponse, LoginCredentials, { rejectValue: string }>(
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
export const fetchUserProfile = createAsyncThunk<User,void,{rejectValue:string}>(
    "auth/fetchUserProfile",
    async (_,{rejectWithValue})=>{
        const token = localStorage.getItem('token');
        if (!token) return rejectWithValue('Chưa đăng nhập');
        try {
            const response = await fakeGetProfileApi(token);
            return response.user;
        } catch (error: any) {
            localStorage.removeItem('token');
            return rejectWithValue(error.message);
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
        }).addCase(fetchUserProfile.pending, (state) => {
            state.loading = true;
        }).addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<User>) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload;
        }).addCase(fetchUserProfile.rejected, (state) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
        });
    }
})

export const {logout, clearError} = authSlice.actions;
export default authSlice.reducer;