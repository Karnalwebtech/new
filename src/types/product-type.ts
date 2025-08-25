interface Filedata {
    [key: string]: string; // Dynamic keys, but values must be strings
}
export interface ProductCategoryFormData {
title:string,
name?:string,
handle?:string,
description?:string,
status?:string,
visibility?:string,
keywords?: string[];
meta_canonical_url: string;
meta_description: string;
FileData?: Filedata[];
meta_title: string;
}
export interface GetResponseProductCategory {
    result:ProductCategoryFormData[],
    success:boolean,
    dataCounter:number;
}