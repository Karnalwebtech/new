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
  SelectCategory,
  SidebarToggle,
  SetDashboard {
  taxMap: Record<string, boolean>;
  selected: string[];
  isDisabled: string[];
}

const initialState: initialStateTypes = {
  isOpen: false,
  typeid: "default",
  limit: 0,
  category: "all",
  isSidebarOpen: true,
  dashboardType: "dashboard",
  taxMap: {},
  selected: [],
  isDisabled: [],
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
      localStorage.setItem(
        "isSidebarOpen",
        JSON.stringify(!state.isSidebarOpen)
      );
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
    toggleTax: (
      state,
      action: PayloadAction<{ code: string; checked: boolean }>
    ) => {
      state.taxMap = state.taxMap ?? {};
      const { code, checked } = action.payload;
      state.taxMap[code] = checked;
    },

    toggleCode: (
      state,
      action: PayloadAction<{ code: string; checked: boolean }>
    ) => {
      state.selected = state.selected ?? []; // ✅ Ensure it's always an array
      const { code, checked } = action.payload;

      if (checked) {
        if (!state.selected.includes(code)) {
          state.selected.push(code);
        }
      } else {
        state.selected = state.selected.filter((c) => c !== code);
      }
    },

    bulkToggleCodes: (
      state,
      action: PayloadAction<{ codes: string[]; checked: boolean }>
    ) => {
      state.selected = state.selected ?? []; // ✅ Ensure it's always an array
      const { codes, checked } = action.payload;

      if (checked) {
        const set = new Set([...state.selected, ...codes]);
        state.selected = Array.from(set);
      } else {
        state.selected = state.selected.filter((c) => !codes.includes(c));
      }
    },
    bulkToggleIsDisabled: (
      state,
      action: PayloadAction<{ codes: string[]; checked: boolean }>
    ) => {
      state.isDisabled = state.isDisabled ?? []; // ✅ Ensure it's always an array
      const { codes, checked } = action.payload;

      if (checked) {
        const set = new Set([...state.isDisabled, ...codes]);
        state.isDisabled = Array.from(set);
      } else {
        state.isDisabled = state.isDisabled.filter((c) => !codes.includes(c));
      }
    },

    clearTaxMap: (state) => {
      state.taxMap = {};
    },
    clearSelected: (state) => {
      state.selected = [];
      state.isDisabled = [];
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
  setCategory,
  sidebarToggle,
  setDashboardType,
  toggleTax,
  toggleCode,
  clearTaxMap,
  clearSelected,
  bulkToggleCodes,
  bulkToggleIsDisabled,
} = helperSlice.actions;
export default helperSlice.reducer;
