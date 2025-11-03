import { CountryStateCityType } from "./country-state-city-type";
import { FulFillmentProviderType } from "./fulfillment-provider-type";
import { SalesChannelsType } from "./sales-channels-type";

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



export interface StockLocationSaleChannelType {
  _id?: string;
  sales_channel_id?: SalesChannelsType;
}


export interface GETResponseStockLocationSaleChannel {
  success: boolean;
  result: StockLocationSaleChannelType[];
   dataCounter: number;
}



export interface LocationFulFillmentProviderType {
  _id?: string;
  fulfillment_provider_id?: FulFillmentProviderType;
}


export interface GETResponseLocationFulFillmentProvider {
  success: boolean;
  result: LocationFulFillmentProviderType[];
   dataCounter: number;
}