import { User } from "./user-type";

export interface updateProfileField {
    name?: string;
    email?: string;
    bio?: string;
    dateOfBirth?: string | undefined;
    profile_image?: string;
    phone?: number;
    gender?: string;
}
export interface UpdateProfilePostResponse {
    success: boolean;
    result: User;
}

export interface ChangePasswordForm {
    c_password: string;
    n_password: string;
    cn_password: string;
}