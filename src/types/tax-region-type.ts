import { CountryStateCityType } from "./country-state-city-type";

export interface TaxRegionType {
    country?:string;
    country_code?:CountryStateCityType;
    _id?:string;
    id?:string;
    tax_provider?:string;
    name?: string | undefined;
    tax_rate?: string | undefined;
    tax_code?: string | undefined;
    createdAt?:Date;
    updatedAt?:Date;
}

export interface GetResponseTaxRegion {
   success:true;
   result:TaxRegionType[];
   dataCounter:number;
}
export interface GetResponseTaxRegionDetails {
   success:true;
   result:TaxRegionType;
}