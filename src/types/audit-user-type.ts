interface ActionDetails {
    description:string;
  }
export interface AuditLog {
    id: string;
    user: string;
    actionType: "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT" | "OTHER";
    details?: ActionDetails; // Type-safe additional metadata
    is_active:boolean;
    createdAt:string;
 
}
export interface AuditLogQuery {
    rowsPerPage?: number;
    actionType?: "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT" | "OTHER";
    page?: number;
}
export interface AuditLogGetResponse {
    success:boolean;
    result:AuditLog[] ;
    dataCounter: number;
}