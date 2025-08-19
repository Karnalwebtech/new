export type FieldType = "text" | "textarea" | "dropdown" | "number" | "email";

export interface customFields {
  id?: string;
  type: FieldType;
  label: string;
  page_id?: string | undefined;
  search_type?: string | undefined;
  field_type?: string | undefined;
  placeholder: string;
  required: boolean;
  options?: string[]; // Only applicable if type is "dropdown"
  _id?: string;
  __v?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GetCustomFieldsResponse {
  success: boolean;
  result: customFields[];
}
