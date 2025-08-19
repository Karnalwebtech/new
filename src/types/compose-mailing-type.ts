export interface ComposeMailingFrom {
    status: string,
    date: Date | undefined,
    content: string,
    field: string,
    ccRecipients: string[],
    bccRecipients: string[],
    recipients: string[],
    subject: string,
    mailList: string,
}

export interface ComposeMailingList {
    _id: string;
    status: string,
    date: Date | undefined,
    content: string,
    totalRecipients:number;
    field: string,
    ccRecipients: string[],
    bccRecipients: string[],
    recipients: string[],
    subject: string,
    updatedAt:string;
    mailList: string,
}
export interface GetComposeMailingResponse {
    success: boolean;
    result: ComposeMailingList[];
    dataCounter: number;
}