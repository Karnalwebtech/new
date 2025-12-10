import { InventoryType } from "./inventory-type";

export interface ReservationsType {
  reserve: string;
  location: string;
  location_id?:string;
  inventory_item_id?: InventoryType;
  quantity?: number;
  description?: string;
  _id?: string;
  id?: string;
  createdAt?: string;
}

export interface GetResponseAllReservations {
  success: boolean;
  result: ReservationsType[];
  dataCounter: number;
}

export interface GetResponseReservationsDetails {
  success: boolean;
  result: ReservationsType;
}
