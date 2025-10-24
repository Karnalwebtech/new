export interface ReturnReasonType {
    value:string;
    _id?:string;
    id?:string;
    description:string;
    label:string;
    is_disabled?:boolean;
    createdAt?:Date;
    updatedAt?:Date;
}

export interface GetResponseReturnReason {
   success:true;
   result:ReturnReasonType[];
   dataCounter:number;
}
export interface GetResponseReturnReasonDetails {
   success:true;
   result:ReturnReasonType;
}