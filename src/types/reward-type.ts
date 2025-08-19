import { User } from "./user-type";

export interface Reward {
  rewardType: 'cash' | 'discount' | 'points';
  user: User;
  amount: number;
  status:'pending' | 'processing' | 'complete' | 'decline' | "paid";
  referralid: string;
  claimedAt:string;
  _id:string;
}
export interface RewardsSummary{
  totalRewards:number;
pendingRewards:number;
processingRewards:number;
paidRewards:number;
declinedRewards:number;
}
export interface getRewardResponse {
    success:true;
    result:Reward[];
    dataCounter:number;
    rewardsSummary:RewardsSummary;
} 