import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/api";

export const fetchBoards = createAsyncThunk(
  "boards/fetchBoards",
  async (userName: string) => {
    const res = await api.get(`/boards?user_name=${userName}`);
    return res.data;
  }
);

export const createBoard = createAsyncThunk(
  "boards/createBoard",
  async (data: { title: string; user_name: string }) => {
    const res = await api.post("/boards", data);
    return res.data;
  }
);

const boardsSlice = createSlice({
  name: "boards",
  initialState: {
    boards: [] as any[],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoards.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.loading = false;
        state.boards = action.payload;
      })
      .addCase(createBoard.fulfilled, (state, action) => {
        state.boards.push(action.payload);
      });
  },
});

export default boardsSlice.reducer;