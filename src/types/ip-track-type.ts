export interface GeoLocation {
    coordinates: { type: [number, number] }; // [longitude, latitude]
    country?: string;
    state?: string;
    city?: string;
    region?: string;
    address?: string;
}
export interface IPLog {
    user: string; // Store multiple user IDs
    ip: string; // IP Address
    type: string; // PC, Mobile, Tablet
    geoLocation: GeoLocation;
    os: string; // Windows, Mac, Linux, iOS, Android
    browser: string; // Chrome, Firefox, Safari, etc.
    userAgent: string; // Raw User-Agent String
    createdAt: Date; // Last usage timestamp
    updatedAt: Date; // Last usage timestamp
}

export interface IPLogGetResponse {
    success: boolean;
    result: IPLog[];
    dataCounter: number;
}
export interface IPLogs {
    _id: string; // Store multiple user IDs
    actionType: string; // PC, Mobile, Tablet
    id: string; // Store multiple user IDs
    ip: IPLog; // IP Address
    geoLocation: GeoLocation;
    os: string; // Windows, Mac, Linux, iOS, Android
    createdAt: string; // Last usage timestamp
    updatedAt: string; // Last usage timestamp
}


export interface GETIPLogSResponse {
    success: boolean;
    result: IPLogs[];
    dataCounter: number;
}