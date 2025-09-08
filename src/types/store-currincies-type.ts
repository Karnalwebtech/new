import { CurrencyItem } from "./currency-type";

export interface StoreCurrenciesType {
  _id: string;
  id: string;
  tax_inclusive: boolean;
  is_default: boolean;
  currency_id: CurrencyItem;
}

export interface GetAllResponseStoreCurrencies {
  success: boolean;
  result: StoreCurrenciesType[];
  dataCounter: number;
}
