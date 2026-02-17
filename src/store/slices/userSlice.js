import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useUser } from "@clerk/nextjs";

// Async thunk to fetch current user data from DB
export const fetchCurrentUser = createAsyncThunk(
  "user/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/users/current");
      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }
      const data = await response.json();
      return data.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Async thunk to update user info
export const updateUserInfo = createAsyncThunk(
  "user/updateUserInfo",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/users/updateUserInfo", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update user");
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  clerkUser: null,
  dbUser: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setClerkUser: (state, action) => {
      state.clerkUser = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    clearUser: (state) => {
      state.clerkUser = null;
      state.dbUser = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    setDbUser: (state, action) => {
      state.dbUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch current user
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.dbUser = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update user info
      .addCase(updateUserInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.dbUser = action.payload;
      })
      .addCase(updateUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setClerkUser, clearUser, setDbUser } = userSlice.actions;
export default userSlice.reducer;
