import { FileData } from "./file-types";
import { SEO } from "./list-type";

interface FiledataKeyAndPair {
  [key: string]: string; // Dynamic keys, but values must be strings
}
export interface ProductCategoryFormDataChild {
  title: string;
  name?: string;
  handle?: string;
  description?: string;
  status?: string;
  visibility?: string;
  keywords?: string[];
  meta_canonical_url: string;
  rank?: number;
  id?: string;
  isExpanded?: boolean;
  parent_category_id?: string;
  meta_description: string;
  FileData?: FiledataKeyAndPair[];
  thumbnail?: FileData | undefined;
  meta_title: string;
}
export interface ProductCategoryFormData {
  title: string;
  _id?: string;
  name?: string;
  handle?: string;
  description?: string;
  status?: string;
  visibility?: string;
  keywords?: string[];
  meta_canonical_url: string;
  rank?: number;
  id?: string;
  isExpanded?: boolean;
  parent_category_id?: string;
  seo_id?: SEO;
  meta_description: string;
  FileData?: FiledataKeyAndPair[];
  thumbnail?: FileData | undefined;
  meta_title: string;
  categoryId: string[];
  children?: ProductCategoryFormDataChild[];
}
export interface GetResponseProductCategory {
  result: ProductCategoryFormData[];
  success: boolean;
  dataCounter: number;
}

export interface GetSingleResponseProductCategory {
  result: ProductCategoryFormData;
  success: boolean;
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
