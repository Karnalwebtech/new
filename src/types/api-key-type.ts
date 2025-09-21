import { User } from "./user-type";

export interface ApiKeyType {
  name: string;
  _id?: string;
  id?: string;
  last_used_at?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  	token?:string;
    revoked?:boolean;
  	salt?:string;
    type?:string;
  	redactedToken?:string;
    revoked_at?:Date;
    revoked_by?:User;
    created_by?:User;
}

export interface GetResponseApiKey {
  success: true;
  result: ApiKeyType[];
  dataCounter: number;
}
export interface GetResponseApiKeyDetails {
  success: true;
  result: ApiKeyType;
}
