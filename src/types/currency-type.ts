export interface CurrencyItem {
  code: string;
  name: string;
  countries?: string[];
  tax_inclusive_pricing?: boolean;
  digits?: number;
  number?: string;
  _id?: string;
}

export interface GetAllCurrenciesResponse {
  success: true;
  result: CurrencyItem[];
  dataCounter: number;
}
