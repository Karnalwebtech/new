import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ToggleState {
  isOpen: boolean;
}
interface Type {
  typeid: string;
}
interface MaxLimit {
  limit: number;
}
interface SetDashboard {
  dashboardType: string;
}
interface SidebarToggle {
  isSidebarOpen: boolean;
}
interface SelectCategory {
  category: string;
}
interface initialStateTypes
  extends ToggleState,
  Type,
  MaxLimit,
  SelectCategory, SidebarToggle, SetDashboard { }

const initialState: initialStateTypes = {
  isOpen: false,
  typeid: "default",
  limit: 0,
  category: "all",
  isSidebarOpen: true,
  dashboardType: "dashboard"

};
const helperSlice = createSlice({
  name: "helper",
  initialState,
  reducers: {
    open: (state) => {
      state.isOpen = true;
    },
    close: (state) => {
      state.isOpen = false;
    },
    toggle: (state) => {
      state.isOpen = !state.isOpen;
    },
    sidebarToggle: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
       localStorage.setItem("isSidebarOpen", JSON.stringify(!state.isSidebarOpen));
    },
    setDashboardType: (state, action: PayloadAction<string>) => {
      state.dashboardType = action.payload;
      localStorage.setItem("dashboardType", action.payload);
    },
    setTypeid: (state, action: PayloadAction<string>) => {
      state.typeid = action.payload;
    },
    setMaxLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
    setCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload;
    },
    clearMaxLimit: (state) => {
      state.limit = 0;
    },
    clearTypeid: (state) => {
      state.typeid = "default";
    },
  },
});
export const {
  open,
  close,
  toggle,
  setTypeid,
  clearTypeid,
  setMaxLimit,
  clearMaxLimit,
  setCategory, sidebarToggle, setDashboardType
} = helperSlice.actions;
export default helperSlice.reducer;
