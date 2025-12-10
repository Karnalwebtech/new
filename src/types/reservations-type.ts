export interface ReservationsType {
  reserve: string;
  location: string;
  quantity?: number;
  description?: string;
  _id?: string;
  id?: string;
}

export interface GetResponseAllReservations {
  success: boolean;
  // result: InventoryType[];
  dataCounter: number;
}

export interface GetResponseInventoryDetails {
  success: boolean;
  // result: InventoryType;
  // total?: number;
  // totalPages?: number;
  // limit?: number;
  // page?: number;
}
