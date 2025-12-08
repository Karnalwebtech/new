export interface InventoryType {
  title: string;
  sku?: string;
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
  quantities?: Record<string, number>[];
}
