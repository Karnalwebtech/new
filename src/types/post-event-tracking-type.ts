// types/tracking.ts
export type SocialPlatform = 'facebook' | 'twitter' | 'linkedin' | 'whatsapp' | 'reddit' | 'email' | "site" | "instapaper" | "tumblr" | "threads" | "pinterest"

export interface MonthlyStats {
  downloads: number;
  shares: number;
  month: string;
}
interface Post {
  _id: string;
  title: string;
}
interface GeoLocation {
  country: string;
  city: string;
  region: string;
}
interface IP {
  _id: string;
  ip: string;
  os: string;
  browser: string;
  geoLocation: GeoLocation;
}
export interface TrackingEvent {
  _id: string;
  post_id: Post;
  __v: number;
  createdAt: string;
  download: number;
  is_active: boolean;
  share: number;
  updatedAt: string;
}
export interface TrackingEventDetails {
  _id: string;
  type: string;
  post_id: Post;
  platform: string;
  ip: IP;
  __v: number;
  createdAt: string;
  download: number;
  is_active: boolean;
  share: number;
  updatedAt: string;
}

export interface PlatformShareCount {
  _id: SocialPlatform;
  count: number;
}

export interface BaseActionTotals {
  totalShares: number;
  totalDownloads: number;
}

export interface ActionTotals extends BaseActionTotals {
  _id: null;
}

export interface VisitorMetrics {
  uniqueUserCount: number;
  uniqueIPCount: number;
}

export interface UniqueVisitors extends VisitorMetrics {
  _id: null;
}

export interface MonthlyStatistics {
  sharesByPlatform: PlatformShareCount[];
  totals: BaseActionTotals;
  uniqueVisitors: VisitorMetrics;
  activePosts: number;
}

export interface TrackingApiResponse {
  success: boolean;
  result: TrackingEvent[];
  dataCounter: number;
  totals: BaseActionTotals & VisitorMetrics;
  currentMonthStats: MonthlyStatistics;
  previousMonthStats: MonthlyStatistics;
}
export interface TrackingDetailsApiResponse {
  success: boolean;
  result: TrackingEventDetails[];
  dataCounter: number;
  totals: BaseActionTotals & VisitorMetrics;
  currentMonthStats: MonthlyStatistics;
  previousMonthStats: MonthlyStatistics;
  monthlyStats: MonthlyStats[]
}
