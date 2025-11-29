// hooks/useConditionalPrices.ts
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { useCallback } from "react";
import { 
  addConditionalPrice, 
  addBulkConditionalPrices, 
  removeConditionalPrice,
  clearConditionalPrices,
  updateConditionalPrice 
} from "@/reducers/conditional-prices-slice";
import { ConditionalPrice } from "@/components/price-manager/conditional-prices-manager";

export const useConditionalPrices = () => {
  const dispatch = useDispatch();
  const conditionalPrices = useSelector((state: RootState) => state.conditionalPrices);

  const addPrice = useCallback((price: ConditionalPrice) => {
    dispatch(addConditionalPrice(price));
  }, [dispatch]);

  const addPrices = useCallback((prices: ConditionalPrice[]) => {
    dispatch(addBulkConditionalPrices(prices));
  }, [dispatch]);

  const removePrice = useCallback((id: string) => {
    dispatch(removeConditionalPrice(id));
  }, [dispatch]);

  const updatePrice = useCallback((id: string, updates: Partial<Omit<ConditionalPrice, "id">>) => {
    dispatch(updateConditionalPrice({ id, updates }));
  }, [dispatch]);

  const clearPrices = useCallback(() => {
    dispatch(clearConditionalPrices());
  }, [dispatch]);

  const getPricesByCurrency = useCallback((currencyKey: string) => {
    return conditionalPrices.prices.filter(price => price.currencyKey === currencyKey);
  }, [conditionalPrices.prices]);

  return {
    prices: conditionalPrices.prices,
    loading: conditionalPrices.loading,
    error: conditionalPrices.error,
    lastUpdated: conditionalPrices.lastUpdated,
    addPrice,
    addPrices,
    removePrice,
    updatePrice,
    clearPrices,
    getPricesByCurrency,
  };
};