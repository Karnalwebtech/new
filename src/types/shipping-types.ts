
export interface ShippingProfileTypes{
   name?:string;
   type?:string;
   _id?:string;
   id?:string;
}
export interface GetResponseShippingProfile {
   success:true;
   result:ShippingProfileTypes[];
   dataCounter:number;
}
export interface GetResponseShippingProfileDetails {
   success:true;
   result:ShippingProfileTypes;
}


export interface ShippingOptionTypes{
   name?:string;
   code?:string;
   description?:string;
   _id?:string;
   id?:string;
}
export interface GetResponseShippingOptionType {
   success:true;
   result:ShippingOptionTypes[];
   dataCounter:number;
}
export interface GetResponseShippingOptionTypeDetails {
   success:true;
   result:ShippingOptionTypes;
}