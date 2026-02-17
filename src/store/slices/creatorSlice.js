import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch creator by username
export const fetchCreatorByUsername = createAsyncThunk(
  "creator/fetchCreatorByUsername",
  async (username, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/creators/${username}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Creator not found");
        }
        throw new Error("Failed to fetch creator");
      }
      const data = await response.json();
      return data.creator;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to fetch current user's creator profile
export const fetchCurrentCreator = createAsyncThunk(
  "creator/fetchCurrentCreator",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/creators/current");
      if (!response.ok) {
        throw new Error("Failed to fetch creator");
      }
      const data = await response.json();
      return data.creator;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  currentCreator: null,
  viewedCreator: null,
  loading: false,
  error: null,
};

const creatorSlice = createSlice({
  name: "creator",
  initialState,
  reducers: {
    setCurrentCreator: (state, action) => {
      state.currentCreator = action.payload;
    },
    clearCreator: (state) => {
      state.currentCreator = null;
      state.viewedCreator = null;
      state.error = null;
    },
    clearViewedCreator: (state) => {
      state.viewedCreator = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch creator by username
      .addCase(fetchCreatorByUsername.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCreatorByUsername.fulfilled, (state, action) => {
        state.loading = false;
        state.viewedCreator = action.payload;
      })
      .addCase(fetchCreatorByUsername.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch current creator
      .addCase(fetchCurrentCreator.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentCreator.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCreator = action.payload;
      })
      .addCase(fetchCurrentCreator.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentCreator, clearCreator, clearViewedCreator } =
  creatorSlice.actions;
export default creatorSlice.reducer;
