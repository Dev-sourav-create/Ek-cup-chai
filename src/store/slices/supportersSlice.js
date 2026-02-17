import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch supporters for a creator
export const fetchSupporters = createAsyncThunk(
  "supporters/fetchSupporters",
  async ({ creatorId, limit = 8 }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `/api/supporters?creatorId=${creatorId}&limit=${limit}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch supporters");
      }
      const data = await response.json();
      return data.supporters;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to create a new supporter (initiate payment)
export const createSupporter = createAsyncThunk(
  "supporters/createSupporter",
  async (supporterData, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/supporters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(supporterData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create supporter");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  supporters: [],
  loading: false,
  error: null,
  creating: false,
  createError: null,
};

const supportersSlice = createSlice({
  name: "supporters",
  initialState,
  reducers: {
    clearSupporters: (state) => {
      state.supporters = [];
      state.error = null;
    },
    addSupporter: (state, action) => {
      state.supporters.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch supporters
      .addCase(fetchSupporters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSupporters.fulfilled, (state, action) => {
        state.loading = false;
        state.supporters = action.payload;
      })
      .addCase(fetchSupporters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create supporter
      .addCase(createSupporter.pending, (state) => {
        state.creating = true;
        state.createError = null;
      })
      .addCase(createSupporter.fulfilled, (state, action) => {
        state.creating = false;
        // Optionally add the new supporter to the list
        // Note: The actual supporter record is created after payment
      })
      .addCase(createSupporter.rejected, (state, action) => {
        state.creating = false;
        state.createError = action.payload;
      });
  },
});

export const { clearSupporters, addSupporter } = supportersSlice.actions;
export default supportersSlice.reducer;
