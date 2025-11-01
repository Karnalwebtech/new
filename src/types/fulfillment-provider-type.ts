
export interface FulFillmentProviderType {
   name:string;
   _id?:string;
   id?:string;
}


export interface GETResponseFulFillmentProvider {
    success: boolean;
    result: FulFillmentProviderType[];
    dataCounter: number;
}