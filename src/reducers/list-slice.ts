

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ListState {
  categories: string[];
  tags: string[];
}

const initialState: ListState = {
  categories: [],
  tags: [],
};

const ListSlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    addCategory: (state, action: PayloadAction<string>) => {
      if (!state.categories.includes(action.payload)) {
        state.categories.push(action.payload);
      }
    },
    removeCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter((id) => id !== action.payload);
    },
    removeAllCategory: (state) => {
      state.categories = []
    },
    removeAlltags: (state) => {
      state.tags = []
    },
    addTag: (state, action: PayloadAction<string>) => {
      if (!state.tags.includes(action.payload)) {
        state.tags.push(action.payload);
      }
    },
    removeTag: (state, action: PayloadAction<string>) => {
      state.tags = state.tags.filter((id) => id !== action.payload);
    },
  },
});

export const { addCategory, removeCategory, addTag, removeTag, removeAllCategory, removeAlltags } =
  ListSlice.actions;

export default ListSlice.reducer;
