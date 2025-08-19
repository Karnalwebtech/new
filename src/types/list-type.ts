import { File } from "@/reducers/file-slice";
import { User } from "./user-type";
interface SEO {
    metaCanonicalUrl: string;
    metaDescription: string;
    metaTitle: string;
    keywords: string[];
}
export interface ListResult {
    _id: string;
    is_active: boolean;
    content: string;
    downloadurl:string;
    description: string;
    keywords: string[];
    feature_image: File;
    banner_image: File;
    status: string;
    categories?:string[];
    tags?:string[];
    title: string;
    type: string;
    user: User;
    seo?: SEO;
    updatedAt: string;
    id: string;
}