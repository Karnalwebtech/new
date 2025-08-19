import { ListResult } from "./list-type";

interface Filedata {
    [key: string]: string; // Dynamic keys, but values must be strings
}
export interface TagFormData {
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

export interface getTagResponse {
    success: boolean;
    result: ListResult[];
    dataCounter: number;
}
export interface getTagDetailsResponse {
    success: boolean;
    result: ListResult;
}