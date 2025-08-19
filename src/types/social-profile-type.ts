export interface SocialProfileForm {
    _id?: string | undefined;
    id?: string | undefined;
    title: string;
    platform: string;
    url: string;
    createdAt?:string | undefined;
    updatedAt?:string | undefined;
}
export interface GetsocialProfileDetails {
    success: boolean;
    result: SocialProfileForm;
}
export interface GetsocialProfiles {
    success: boolean;
    result: SocialProfileForm[];
}