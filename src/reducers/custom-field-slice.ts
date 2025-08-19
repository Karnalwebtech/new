import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { FormField } from "@/types/custom-field-types";
import { customFields } from "@/types/custom-field-types";

interface CustomFieldState {
  customFields: customFields[];
}

const initialState: CustomFieldState = {
  customFields: [],
};

const CustomField = createSlice({
  name: "customField",
  initialState,
  reducers: {
    addCustomField: (state, action: PayloadAction<customFields[]>) => {
      state.customFields.push(...action.payload);
    },
  },
});

export const { addCustomField } = CustomField.actions;
export default CustomField.reducer;
