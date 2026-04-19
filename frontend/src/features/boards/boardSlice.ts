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

export const fetchBoardById = createAsyncThunk(
  "boards/fetchBoardById",
  async (id: string) => {
    const res = await api.get(`/boards/${id}`);
    return res.data;
  }
);

const boardsSlice = createSlice({
  name: "boards",
  initialState: {
    boards: [] as any[],
    currentBoard: null as any,
    loading: false,
  },
  reducers: {
      setBoard(state, action) {
      state.currentBoard = action.payload;
    },
      updateBoardState(state, action) {
      if (!state.currentBoard) return;

      state.currentBoard = {
        ...state.currentBoard,
        ...action.payload,
      };
    },
    replaceColumn(state, action) {
      const { tempId, newColumn } = action.payload;

      if (!state.currentBoard) return;

      state.currentBoard.columns = state.currentBoard.columns.map((col: any) =>
        col && col.id === tempId ? newColumn : col
      );
    },
    updateColumnTitle(state, action) {
      const { columnId, title } = action.payload;

      if (!state.currentBoard) return;

      state.currentBoard.columns = state.currentBoard.columns.map((col: any) =>
        col.id === columnId
          ? { ...col, title }
          : col
      );
    }
  },
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
      })
      .addCase(fetchBoardById.fulfilled, (state, action) => {
        state.currentBoard = action.payload;
      });
  },
});

export const { setBoard, updateBoardState, replaceColumn, updateColumnTitle } = boardsSlice.actions;
export default boardsSlice.reducer;