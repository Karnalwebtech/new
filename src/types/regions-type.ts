import { CountryStateCityType } from "./country-state-city-type";

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
  country_id:CountryStateCityType;
  region_id:RegionFrom;
}

export interface GetAllRegionsResponse {
  success: boolean;
  result: RegionCountryData[];
  dataCounter: number;
}
