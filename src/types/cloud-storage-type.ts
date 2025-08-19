type CustomFieldsType = Record<string, string | number | boolean | object | null>;
export type GetCloudStorage = {
    success: boolean;
    result: DriveUsage[];
  };
  
  export type DriveUsage = {
    type: string;
    free: string;
    total: string;
    trash: string;
    used: string;
  };

  export interface CloudStorageForm {
    storage_type:string,
    customFields?: CustomFieldsType;
  }
  

  export interface ResultCloudStorage {
    _id:string;
    user: string; // Reference to the user who owns the storage
    id: string; // Reference to the user who owns the storage
    storage_type: string; // Indicates if the storage is active
    is_active: boolean; // Indicates if the storage is active
    custom_fields?: CustomFieldsType;
    updatedAt?:string;
}
  export interface GetCloudStorageResponse{
     success:boolean;
     result:ResultCloudStorage[],
     dataCounter:number
  }