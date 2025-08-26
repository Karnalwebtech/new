import { FileData } from "./file-types";

interface FiledataKeyAndPair {
    [key: string]: string; // Dynamic keys, but values must be strings
}

export interface ProductCategoryFormDataChield {
title:string,
name?:string,
handle?:string,
description?:string,
status?:string,
visibility?:string,
keywords?: string[];
meta_canonical_url: string;
rank?:number;
id?:string;
isExpanded?:boolean;
parent_category_id?:string;
meta_description: string;
FileData?: FiledataKeyAndPair[];
thumbnail?:FileData | undefined;
meta_title: string;
}
export interface ProductCategoryFormData {
title:string,
_id?:string;
name?:string,
handle?:string,
description?:string,
status?:string,
visibility?:string,
keywords?: string[];
meta_canonical_url: string;
rank?:number;
id?:string;
isExpanded?:boolean;
parent_category_id?:string;
meta_description: string;
FileData?: FiledataKeyAndPair[];
thumbnail?:FileData | undefined;
meta_title: string;
children?:ProductCategoryFormDataChield[];
}
export interface GetResponseProductCategory {
    result:ProductCategoryFormData[],
    success:boolean,
    dataCounter:number;
}


// // Raw API response type for better type safety
// export interface RawCategoryData {
//   id?: string
//   _id?: string | { toString(): string }
//   name?: string
//   title?: string
//   rank?: number | string
//   children?: RawCategoryChild[]
//   [key: string]: any
// }

// export interface RawCategoryChild {
//   id?: string
//   _id?: string | { toString(): string }
//   name?: string
//   title?: string
//   order?: number
//   isNew?: boolean
//   [key: string]: any
// }
