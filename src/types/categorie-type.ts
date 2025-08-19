
import { ListResult } from "./list-type";

interface Filedata {
    [key: string]: string; // Dynamic keys, but values must be strings
}
export interface CategorieFormData {
    content: string;
    id?:string;
    description: string;
    keywords: string[];
    metaCanonicalUrl: string;
    metaDescription: string;
    FileData: Filedata[];
    metaTitle: string;
    status: string;
    title: string;
    type: string;
}
export interface getCateforieResponse {
    success: boolean;
    result: ListResult[];
    dataCounter: number;
}
export interface getCateforieDetailsResponse {
    success: boolean;
    result: ListResult;
}