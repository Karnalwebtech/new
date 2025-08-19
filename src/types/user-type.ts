import { File } from "@/reducers/file-slice";

export interface User {
    user: string;
    _id:string;
    name: string;
    email: string;
    password: string;
    bio:string;
    profile_image:File;
    image: string;
    createdAt:string;
    provider: string;
    isVerified?: boolean;
    forgotPasswordToken?: string;
    forgotPasswordTokenExpiry?: Date;
    verifyToken?: string | undefined;
    verifyTokenExpiry?: Date;
    role: 'user' | 'admin' | 'agent';
    dashboard: 'user' | 'admin' | 'agent';
    dateOfBirth?: string | undefined;
    phone?: string;
    address?: string;
    gender?: 'male' | 'female' | 'other';
    socialProfiles?: { platform: string; url: string }[] | undefined;
    lastLogin?: Date;
    is2FAEnabled?: boolean;
    resetPasswordToken?: string;
    resetPasswordTokenExpiry?: Date;
    subscriptionPlan?: string;
    isProfileComplete?: boolean;
    isAccountLocked?: boolean;
    deactivatedAt?: Date;
    referralCode?: string;
    updatedAt?:string;
    ip_log?:string;
    ip?:string;
  }
  
  export interface formData {
    email: string;
    name: string;
    phone:number;
    password: string;
    referredCode?:string;
  }
  export interface LoginFormData {
    email: string;
    password: string;
    provider?:string | undefined;
  }
  export interface forgetPasswordData {
    email: string;
  }
  export interface SignupResponse {
    success: boolean;
    message: string;
    token?: string | undefined; // token is sometimes missing
  }
  export interface SigninResponse {
    success: boolean;
    user: User;
    token?: string | undefined; // token is sometimes missing
  }
  
  export interface AuthState {
    user: formData | null;
    token: string | null;
  }
  export interface otpState {
    otpValue: string;
    token: string | null;
  }
  export interface resendState {
    token: string | null;
  }
  export interface OTPFormData {
    otp: string;
  }
  // users
  export interface GetAllUserResponse {
    success:boolean;
    result:User[];
    dataCounter: number;
  }
