
export interface configForm {
  _id: string;
  key: string;
  value: string;
  isSecret: boolean;
  environment: string;
}
export interface Result {
  _id: string;
  key: string;
  value: string;
  isSecret: boolean;
  environment: string;
}

export interface configGetResponse {
  success: boolean;
  result: Result[];
}
