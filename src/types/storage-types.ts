interface AccessControl {
    isPrivate: boolean; // Determines if storage is private or public
    sharedWith: string;
    permissions: {
        user: string; // User ID of the person with access
        accessType: 'read' | 'write' | 'admin'; // Permission level
    }[];
}

export interface storageResult {
    user: string;
    planType: 'free' | 'premium' | 'enterprise';
    totalStorage: number;
    usedStorage: number;
    createdAt: Date;
    updatedAt: Date;
    availableStorage: number; // Remaining available storage
    storageType: 'local' | 'cloud'; // Type of storage
    cloudProvider?: 'aws' | 'gcp' | 'azure' | 'other' | 'google drive'; // Cloud provider if storage is cloud-based
    accessControl: AccessControl;
    retentionPolicy: {
        autoDelete: boolean; // Whether files are auto-deleted after retention period
        retentionPeriod: number; // Retention period in days
    };
    encryption: {
        enabled: boolean; // Whether encryption is enabled
        algorithm?: string; // Encryption algorithm used (if enabled)
    };
    backup: {
        enabled: boolean; // Whether backups are enabled
        frequency: 'daily' | 'weekly' | 'monthly'; // Backup frequency
        lastBackup: Date; // Timestamp of the last backup
    };
    is_active: boolean; // Indicates if the storage is active
}
export interface storageGetResponse {
    success: boolean,
    result: storageResult,
}