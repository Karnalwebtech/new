export interface SocialProfileForm {
    _id?: string | undefined;
    id?: string | undefined;
    title: string;
    platform: string;
    url: string;
    createdAt?: string | undefined;
    updatedAt?: string | undefined;
}
export interface GetAllResponseShippingOptions {
    success: boolean;
    result: SocialProfileForm[]; dataCounter: number;
}
