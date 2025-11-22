export interface ServiceZoneType {
    name: string;
    areas: string[];
    type:string;
    fulfillment_set_id: string;
}

export interface GetResponseServiseZoneType {
   success:true;
   result:ServiceZoneType[];
   dataCounter:number;
}