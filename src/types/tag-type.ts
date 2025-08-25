import { ListResult } from "./list-type";

interface Filedata {
    [key: string]: string; // Dynamic keys, but values must be strings
}
export interface TagFormData {
    content: string;
    id?:string;
    description: string;
    keywords: string[];
    meta_canonical_url: string;
    meta_description: string;
    FileData: Filedata[];
    meta_title: string;
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