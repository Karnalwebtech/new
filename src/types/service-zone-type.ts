import { CountryStateCityType } from "./country-state-city-type";

export interface ServiceZoneType {
  _id?: string;
  id?: string;
  name: string;
  areas: string[];
  type: string;
  fulfillment_id?: string;
  fulfillment_set_id?: string;
}
export interface GeoDataType {
  _id?: string;
  id?: string;
  name: string;
  totalCountries: number;
  more: number;
  country_names: string[];
  country_id:CountryStateCityType;
  service_zone_id: string;
}

export interface GetResponseServiseZoneType {
  success: true;
  result: ServiceZoneType[];
  dataCounter: number;
  geoData: GeoDataType[];
}
export interface GetResponseServiseZoneTypeDetails {
  success: true;
  result: { serviceZones: ServiceZoneType; geozone: GeoDataType[] };
}
