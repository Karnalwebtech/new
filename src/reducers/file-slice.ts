import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface File {
  title: string;
  public_id: string;
  mimetype: string;
  _id: string;
  fileType: string;
  originalname: string;
  category: string;
}

interface FileState {
  files: File[]; // Store array of file objects
}

const initialState: FileState = {
  files: [], // Default empty
};

const fileSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    addFile: (state, action: PayloadAction<File>) => {
      state.files.push(action.payload); // ✅ Add file object to array
    },
    removeFile: (state, action: PayloadAction<string>) => {
      state.files = state.files.filter((file) => file._id !== action.payload); // ✅ Remove file by path
    },
    removeAll: (state) => {
      state.files = []; // ✅ Remove file by path
    },
  },
});

// Export actions
export const { addFile, removeFile, removeAll } = fileSlice.actions;

// Export reducer
export default fileSlice.reducer;
