export interface ContactsForm {
    name?: string;
    email?: string;
    id?: string;
    phone?: string;
    status?: "active" | "inactive";
    tags?: string[];
}

export interface ContactLists {
    name: string;
    email: string;
    _id:string;
    phone: string;
    is_active: string;
    updatedAt: string;
    tags: {_id:string,name:string}[]
}
export interface ContactListsDetails {
    name: string;
    email: string;
    _id:string;
    id?:string;
    phone: string;
    is_active: string;
    updatedAt: string;
    tags: string[]
}

export interface getContactsResponse {
    success: boolean;
    result: ContactLists[];
    dataCounter: number;
}
export interface getContactsDetailsResponse {
    success: boolean;
    result: ContactListsDetails;
}