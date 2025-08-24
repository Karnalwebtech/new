interface Filedata {
    [key: string]: string; // Dynamic keys, but values must be strings
}
export interface ProductCategoryFormData {
title:string,
handle?:string,
description?:string,
status?:string,
visibility?:string,
keywords?: string[];
metaCanonicalUrl: string;
metaDescription: string;
FileData?: Filedata[];
metaTitle: string;
}
