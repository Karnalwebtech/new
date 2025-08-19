import { User } from "./user-type";

export interface ReferredUsers {
  createdAt: string;
  user: User;
  rewardAmount: number;
  referralStatus: string;
  _id: string;
}
export interface RewardClaims {
  amount: number;
  claimedAt: string;
  _id: string;
  referralid: string;
}
export interface Referral {
  createdAt: string;
  expiryDate: string;
  referralGoal: number;
  notes: string;
  referralBonus: number;
  referralClicks: number;
  referralCode: string;
  referralHierarchy: ReferredUsers[];
  referralLevel: number;
  referralStatus: string;
  referralType: string;
  referredBy: string;
  referredUsers: string;
  rewardAmount: string;
  rewardClaims: string[];
  rewardType: string;
  rewardsEarned: number;
  successfulConversions: number;
  totalReferrals: number;
  updatedAt: string;
  user: User;
  __v: string;
  _id: string;
}
export interface getresponseReferralDetails {
  success: boolean;
  result: Referral;
  prevData: Referral[];
}

export interface getresponseReferral {
  success: boolean;
  result: Referral[];
  dataCounter: number;
  prevData: Referral[];
}
