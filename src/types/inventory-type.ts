import { CountryStateCityType } from "./country-state-city-type";

interface locationType {
  name?: string;
}
interface inventory_levels {
  location_id?: string;
  id?: string;
  stocked_quantity?: number;
  reserved_quantity?: number;
  location?: locationType;
}
export interface InventoryType {
  title: string;
  sku?: string;
  id?: string;
  description?: string;
  requires_shipping?: boolean;
  width?: number;
  length?: number;
  height?: number;
  weight?: number;
  mid_code?: string;
  hs_code?: string;
  country?: string;
  material?: string;
  quantities?: Record<string, number> | Record<string, number>[];
  inventory_levels_preview?: inventory_levels[];
  total_reserved_quantity?: number;
  total_stocked_quantity?: number;
  origin_country?: string;
  country_info?: CountryStateCityType;
}

export interface GetResponseAllInventory {
  success: boolean;
  result: InventoryType[];
  dataCounter: number;
}

export interface GetResponseInventoryDetails {
  success: boolean;
  result: InventoryType;
  total?: number;
  totalPages?: number;
  limit?: number;
  page?: number;
}
