import { ListResult } from "./list-type";


export interface ContactUs {
    _id: string,
    no: number,
    id: string,
    name: string,
    email: string,
    phone: string,
    subject: string,
    message: string,
    is_read: boolean,
    is_active: boolean,
    ip_log: string,
    createdAt: string,
    updatedAt: string,
}

export interface getContactUsQuiresResponse {
    success: boolean;
    result: ContactUs[];
    dataCounter: number;
}
export interface getPostDetailsResponse {
    success: boolean;
    result: ListResult;
}