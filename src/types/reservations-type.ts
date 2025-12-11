import { InventoryType } from "./inventory-type";
import { StockLocationType } from "./stock-location-type";
interface locationLevelType {
  stocked_quantity?: number;
  reserved_quantity?:number;
}
export interface ReservationsType {
  reserve: string;
  location: StockLocationType;
  quantity?: number | undefined;
  description?: string | undefined;
  location_id?: string;
  inventory_item_id?: InventoryType;
  line_item_id?: string;
  total_stocked_quantity?: number;
  total_reserved_quantity?: number;
  locationLevel?: locationLevelType;
  _id?: string;
  id?: string;
  inventory_item?: InventoryType;
  createdAt?: string;
}

export interface GetResponseAllReservations {
  success: boolean;
  result: ReservationsType[];
  dataCounter: number;
}

export interface GetResponseReservationsDetails {
  success: boolean;
  total: number;
  result: ReservationsType;
}
