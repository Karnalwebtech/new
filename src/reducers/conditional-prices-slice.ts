import { ConditionalPrice } from "@/components/price-manager/conditional-prices-manager";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ConditionalPricesState {
  prices: ConditionalPrice[];
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

const initialState: ConditionalPricesState = {
  prices: [],
  loading: false,
  error: null,
  lastUpdated: null,
};

const conditionalPricesSlice = createSlice({
  name: "conditionalPrices",
  initialState,
  reducers: {
    // ✅ Add a single conditional price
    addConditionalPrice: (state, action: PayloadAction<ConditionalPrice>) => {
      const newPrice = action.payload;
      
      // Check if price with same ID already exists
      const existingIndex = state.prices.findIndex(
        price => price.id === newPrice.id
      );
      
      if (existingIndex >= 0) {
        // Update existing price
        state.prices[existingIndex] = newPrice;
      } else {
        // Add new price
        state.prices.push(newPrice);
      }
      
      state.lastUpdated = new Date().toISOString();
    },

    // ✅ Add multiple conditional prices (bulk)
    addBulkConditionalPrices: (state, action: PayloadAction<ConditionalPrice[]>) => {
      const newPrices = action.payload;
      
      // Create a map of existing prices by ID for quick lookup
      const existingPricesMap = new Map(
        state.prices.map(price => [price.id, price])
      );
      
      // Update or add new prices
      newPrices.forEach(newPrice => {
        if (existingPricesMap.has(newPrice.id)) {
          // Update existing price
          const existingIndex = state.prices.findIndex(
            price => price.id === newPrice.id
          );
          if (existingIndex >= 0) {
            state.prices[existingIndex] = newPrice;
          }
        } else {
          // Add new price
          state.prices.push(newPrice);
        }
      });
      
      state.lastUpdated = new Date().toISOString();
    },

    // ✅ Replace all conditional prices
    setConditionalPrices: (state, action: PayloadAction<ConditionalPrice[]>) => {
      state.prices = action.payload;
      state.lastUpdated = new Date().toISOString();
    },

    // ✅ Remove a conditional price by ID
    removeConditionalPrice: (state, action: PayloadAction<string>) => {
      state.prices = state.prices.filter(
        price => price.id !== action.payload
      );
      state.lastUpdated = new Date().toISOString();
    },

    // ✅ Remove multiple conditional prices by IDs
    removeBulkConditionalPrices: (state, action: PayloadAction<string[]>) => {
      const idsToRemove = new Set(action.payload);
      state.prices = state.prices.filter(
        price => !idsToRemove.has(price.id)
      );
      state.lastUpdated = new Date().toISOString();
    },

    // ✅ Clear all conditional prices
    clearConditionalPrices: (state) => {
      state.prices = [];
      state.lastUpdated = new Date().toISOString();
    },

    // ✅ Update specific fields of a conditional price
    updateConditionalPrice: (
      state, 
      action: PayloadAction<{
        id: string;
        updates: Partial<Omit<ConditionalPrice, "id">>;
      }>
    ) => {
      const { id, updates } = action.payload;
      const priceIndex = state.prices.findIndex(price => price.id === id);
      
      if (priceIndex >= 0) {
        state.prices[priceIndex] = {
          ...state.prices[priceIndex],
          ...updates,
        };
        state.lastUpdated = new Date().toISOString();
      }
    },

    // ✅ Filter prices by currency key
    filterPricesByCurrency: (state, action: PayloadAction<string>) => {
      const currencyKey = action.payload;
      state.prices = state.prices.filter(price => price.currencyKey === currencyKey);
      state.lastUpdated = new Date().toISOString();
    },

    // ✅ Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // ✅ Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // ✅ Reset to initial state
    resetConditionalPrices: (state) => {
      state.prices = [];
      state.loading = false;
      state.error = null;
      state.lastUpdated = null;
    },
  },
});

export const {
  addConditionalPrice,
  addBulkConditionalPrices,
  setConditionalPrices,
  removeConditionalPrice,
  removeBulkConditionalPrices,
  clearConditionalPrices,
  updateConditionalPrice,
  filterPricesByCurrency,
  setLoading,
  setError,
  resetConditionalPrices,
} = conditionalPricesSlice.actions;

export default conditionalPricesSlice.reducer;