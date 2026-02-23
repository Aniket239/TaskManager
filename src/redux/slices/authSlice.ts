import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

interface AuthState {
    user: FirebaseAuthTypes.User | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
};

/* ------------------ THUNKS ------------------ */

// Signup
export const signupUser = createAsyncThunk(
    'auth/signupUser',
    async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await auth().createUserWithEmailAndPassword(email, password);
            return response.user;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Login
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await auth().signInWithEmailAndPassword(email, password);
            return response.user;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Logout
export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
    await auth().signOut();
});

/* ------------------ SLICE ------------------ */

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<FirebaseAuthTypes.User | null>) => {
            state.user = action.payload;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(signupUser.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(loginUser.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(logoutUser.fulfilled, state => {
                state.user = null;
            });
    },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;