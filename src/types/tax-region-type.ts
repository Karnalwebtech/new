import { CountryStateCityType } from "./country-state-city-type";
interface TaxProviderDetailsType{
   name?:string;
   _id?:string;
}
export interface TaxRegionType {
    country?:string;
    country_code?:CountryStateCityType;
    _id?:string;
    id?:string;
    tax_provider?:string;
    tax_provider_details?:TaxProviderDetailsType;
    default_rate?:TaxRegionType;
    name?: string | undefined;
    tax_rate?: string | undefined;
    rate?: string | undefined;
    tax_code?: string;
    code?: string | undefined;
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