import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import auth from '@react-native-firebase/auth';

/* =====================================================
   TYPES
===================================================== */

export interface SerializableUser {
    uid: string;
    email: string | null;
    displayName: string | null;
}

interface AuthState {
    user: SerializableUser | null;
    loading: boolean;
    error: string | null | { code: string; message: string };
}

const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
};

/* =====================================================
   HELPERS
===================================================== */

const mapFirebaseUser = (user: any): SerializableUser => ({
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
});

/* =====================================================
   THUNKS
===================================================== */

// Signup
export const signupUser = createAsyncThunk<
    SerializableUser,
    { email: string; password: string },
    { rejectValue: { code: string; message: string } }
>(
    'auth/signupUser',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await auth().createUserWithEmailAndPassword(
                email,
                password
            );

            return mapFirebaseUser(response.user);
        } catch (error: any) {
            return rejectWithValue({
                code: error.code,
                message: error.message
            });
        }
    }
);

// Login
export const loginUser = createAsyncThunk<
    SerializableUser,
    { email: string; password: string },
    { rejectValue: { code: string; message: string } }
>(
    'auth/loginUser',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await auth().signInWithEmailAndPassword(
                email,
                password
            );

            return mapFirebaseUser(response.user);
        } catch (error: any) {
            return rejectWithValue({
                code: error.code,
                message: error.message
            });
        }
    }
);

// Logout
export const logoutUser = createAsyncThunk<
    void,
    void,
    { rejectValue: { code: string; message: string } }
>('auth/logoutUser', async (_, { rejectWithValue }) => {
    try {
        await auth().signOut();
    } catch (error: any) {
        return rejectWithValue({
            code: error.code,
            message: error.message
        });
    }
});

/* =====================================================
   SLICE
===================================================== */

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<SerializableUser | null>) => {
            state.user = action.payload;
        },
        clearError: state => {
            state.error = null;
        },
    },
    extraReducers: builder => {
        builder

            /* ---------------- SIGNUP ---------------- */
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
                state.error = action.payload ?? 'Signup failed';
            })

            /* ---------------- LOGIN ---------------- */
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
                state.error = action.payload ?? 'Login failed';
            })

            /* ---------------- LOGOUT ---------------- */
            .addCase(logoutUser.pending, state => {
                state.loading = true;
            })
            .addCase(logoutUser.fulfilled, state => {
                state.loading = false;
                state.user = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? 'Logout failed';
            });
    },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;