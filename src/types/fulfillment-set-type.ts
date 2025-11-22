import { StockLocationType } from "./stock-location-type";

export interface FulFillmentSetType {
     name: string;
  type: string;
  stock_location_id?: string;
  fulfillment_set_id?: string;
  metadata?: string;
  deleted_at?: Date | null;
  id?: string;
  _id?: string;
}
export interface LocationFulFillmentSetType {
  stock_location_id?: StockLocationType;
  fulfillment_set_id?: FulFillmentSetType;
  metadata?: string;
  deleted_at?: Date | null;
  id?: string;
}

export interface GETResponseFulFillmentSet {
  success: boolean;
  result: FulFillmentSetType[];
  dataCounter: number;
}

export interface GETResponseLocationFulFillmentSet {
  success: boolean;
  result: LocationFulFillmentSetType[];
  dataCounter: number;
}
