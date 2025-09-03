export interface StoreForm {
  name: string;
  default_currency?: string;
  default_region?: string;
  default_sales_channel?: string;
  default_location?: string;
}

export interface StoreResult {
  name: string;
  default_currency_id?: string;
  default_region_id?: string;
  default_sales_channel_id?: string;
  default_location_id?: string;
}

export interface GETResponseStoreFront {
  success: boolean;
  result: StoreResult;
}