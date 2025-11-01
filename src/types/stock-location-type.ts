import { CountryStateCityType } from "./country-state-city-type";

export interface StockLocationType {
  name: string;
  id?: string;
  _id?: string;
  phone?: string;
  address_1?: string;
  address_2?: string;
  company?: string;
  postal_code?: string;
  city_id?: string;
  country_id?: string;
  country: string;
  state?: string;
  city?: string;
  address_id?: StockLocationType;
  province_id?: string;
}
export interface StockLocationTypeDetails {
   name: string;
  id?: string;
  _id?: string;
  phone?: string;
  address_1?: string;
  address_2?: string;
  company?: string;
  postal_code?: string;
  city_id?: CountryStateCityType;
  country_id?: CountryStateCityType;
  country: string;
  state?: string;
  city?: string;
  address_id?: StockLocationTypeDetails;
  province_id?: CountryStateCityType;
}

export interface GETResponseStockLocationDetails {
  success: boolean;
  result: StockLocationTypeDetails;
}

export interface GetResponseStockLocation {
  success: true;
  result: StockLocationType[];
  dataCounter: number;
}
