export interface SalesChannelsType {
    name:string;
    _id?:string;
    id?:string;
    description:string;
    enabled:boolean;
    is_disabled?:boolean;
    createdAt?:Date;
    updatedAt?:Date;
}

export interface GetResponseSalesChannels {
   success:true;
   result:SalesChannelsType[];
   dataCounter:number;
}
export interface GetResponseSalesChannelsDetails {
   success:true;
   result:SalesChannelsType;
}