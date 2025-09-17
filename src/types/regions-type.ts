import { CountryStateCityType } from "./country-state-city-type";
import { CurrencyItem } from "./currency-type";
import { StoreCurrenciesType } from "./store-currincies-type";

export interface RegionFrom {
  _id?: string;
  id?: string;
  name: string;
  currency_id?: string;
  automatic_taxes: boolean;
  tax_inclusive_pricing: boolean;
  countries: string[];
  providers: string[];
}

export interface RegionCountryData {
  _id?: string;
  id?: string;
  name?: string;
  automatic_taxes?: boolean;
  includes_tax?: boolean;
  // currency_id?: string;
  storeCurrency:StoreCurrenciesType;
  currency:CurrencyItem;
  countries:CountryStateCityType[];
}
export interface GetRegionDetailsResponse {
  success: boolean;
  result: RegionCountryData;
}

export interface GetAllRegionsResponse {
  success: boolean;
  result: RegionCountryData[];
  dataCounter: number;
}
