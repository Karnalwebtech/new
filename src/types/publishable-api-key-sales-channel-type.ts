import { ApiKeyType } from "./api-key-type";
import { SalesChannelsType } from "./sales-channels-type";

export interface PublishableApiKeyType {
  _id?: string;
  id?: string;
  salesId?:string[];
  sales_channel_id?:SalesChannelsType;
  publishable_api_key_id?:ApiKeyType;
}

export interface GetResponsePublishableApiKey {
  success: true;
  result: PublishableApiKeyType[];
  dataCounter: number;
}
export interface GetResponsePublishableApiKeyDetails {
  success: true;
  result: PublishableApiKeyType;
}
