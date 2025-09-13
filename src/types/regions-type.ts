export interface RegionFrom {
  id?: string;
  name: string;
  currency_id?: string;
  automatic_taxes: boolean;
  tax_inclusive_pricing: boolean;
  countries: string[];
  providers: string[];
}

export interface GetAllRegionsResponse {
  success: boolean;
  result: RegionFrom[];
  dataCounter: number;
}
