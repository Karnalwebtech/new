export interface CountryStateCityType {
  name: string;
  _id?: string;
  currency?: string;
  isoCode?:string;
  id?: string;
  flag?: string;
  latitude?: string;
  longitude?: string;
  phoneCode?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GETCountryStateCityResponse {
  success: boolean;
  result: CountryStateCityType[];
  dataCounter: number;
}
