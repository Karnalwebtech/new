export interface MailingListForm {
    name: string;
    id?: string;
    email: string;
    description: string;
    doubleOptIn?: boolean;
    welcomeEmail?: boolean;
    tags: string[];
    contacts?:string[];
    applyToAllSubscribers?:boolean;
}
export interface MailingList {
    name: string;
    id: string;
    email: string;
    _id: string;
    description: string;
    doubleOptIn: boolean;
    welcomeEmail: boolean;
    tags: string[];
    is_active: boolean,
    createdAt: string,
    subscribers:number,
    double_opt:boolean,
    apply_to_all_subscribers:boolean
    welcone_email:boolean,
    updatedAt: string,
}

export interface GetMaillingListResponse {
    success: true;
    result: MailingList[];
    dataCounter:number;
}