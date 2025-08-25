import { ListResult } from "./list-type";

interface Filedata {
    [key: string]: string; // Dynamic keys, but values must be strings
}
export interface PostFormData {
    content: string;
    id?:string;
    description: string;
    keywords: string[];
    meta_canonical_url: string;
    meta_description: string;
    FileData: Filedata[];
    meta_title: string;
    categories:string[];
    tags:string[];
    status: string;
    title: string;
    downloadurl?: string;
}

export interface getPostResponse {
    success: boolean;
    result: ListResult[];
    dataCounter: number;
}
export interface getPostDetailsResponse {
    success: boolean;
    result: ListResult;
}