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

export interface GETResponseStockLocationDetails {
  success: boolean;
  result: StockLocationType;
}

export interface GetResponseStockLocation {
  success: true;
  result: StockLocationType[];
  dataCounter: number;
}
