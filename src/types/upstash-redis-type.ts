export interface UpstashRedisDatabaseConfig {
  all_members: string[]; // All Redis node members (used for replication/failover).
  auto_upgrade: boolean; // Auto-upgrade enabled for performance/security patches.
  budget: number; // Budget limit for usage-based billing.
  consistent: boolean; // Whether strong consistency is enabled.
  creation_time: number; // Timestamp of database creation (for tracking).
  database_id: string; // Unique ID to identify the database.
  database_name: string; // Human-readable name of the database.
  database_type: string; // Type of DB (e.g., "redis").
  db_acl_default_user_status: string; // Default user access status for ACLs.
  db_acl_enabled: string; // Whether Access Control Lists are enabled.
  db_conn_idle_timeout: number; // Max idle time before client connection closes.
  db_disk_threshold: number; // Max disk space allowed (for persistence if any).
  db_eviction: boolean; // If enabled, old keys are evicted when memory is full.
  db_lua_credits_per_min: number; // Max Lua script credits per minute (script rate limiting).
  db_lua_timeout: number; // Timeout for Lua script execution (to avoid blocking).
  db_max_clients: number; // Max simultaneous client connections allowed.
  db_max_commands_per_second: number; // Throughput limit for Redis commands.
  db_max_entry_size: number; // Max size allowed for a single key/value.
  db_max_loads_per_sec: number; // Max read operations per second allowed.
  db_max_request_size: number; // Max size of a single request payload.
  db_memory_threshold: number; // Memory limit before triggering eviction or warnings.
  db_request_limit: number; // Total request cap for the database (for billing).
  db_resource_size: string; // Resource tier or size (like "free", "pro", etc.).
  db_store_max_idle: number; // Max idle time for stored keys before eviction.
  db_type: string; // Backend engine type (e.g., Redis).
  endpoint: string; // Redis endpoint URL to connect to.
  eviction: boolean; // Same as db_eviction (can be used for backward compatibility).
  modifying_state: string; // State info if the DB is being modified/upgraded.
  password: string; // Redis authentication password (used in secure connections).
  port: number; // Redis port (default is usually 6379).
  primary_members: string[]; // Nodes marked as primary (used in clustering).
  primary_region: string; // Primary region for the DB deployment.
  read_only_rest_token: string; // Token for limited read-only REST access.
  region: string; // Main hosting region of the Redis instance.
  reserved_per_region_price: number; // Pricing info for reserved regions.
  rest_token: string; // Full access REST API token.
  state: string; // Current state of the DB (active, paused, etc.).
  tls: boolean; // Whether TLS encryption is enabled for connections.
  type: string; // Resource type (usually "database").
  user_email: string; // Owner or admin user’s email.
}

export interface DataTypeDistribution {
  string: number;
  hash: number;
  list: number;
  set: number;
  sorted_set: number;
  other: number;
}
export interface KeyspaceStatistics {
  database: string;
  total_keys: number;
  keys_with_ttl: number;
  avg_ttl: number;
}
export interface UpstashRedisDatabaseDetails {
  memory_usage_percentage: number;
  used_memory: number;
  free_memory: number;
  peak_memory: number;
  hit_ratio: number;
  operations_per_second: number;
  total_commands_processed: number;
  data_type_distribution: DataTypeDistribution;
  keyspace_statistics: KeyspaceStatistics[];
  region: string;
  total_allocated_memory: number;
  type: string;
  fragmentation_ratio:number;
  eviction_policy:string;
  last_updated:string;
  connected_clients:number;
}
export interface GetUpstashRedisDbDetails {
  success: boolean,
  result: UpstashRedisDatabaseDetails,
}
export interface GetUpstashRedisDbList {
  success: boolean,
  result: UpstashRedisDatabaseConfig[]
}

export interface UpstashRedisEventList {
  type: string,
  key: string,
  instance: string,
  status: string,
  // details: { value: [Object] },
  timestamp: string
}
export interface GetUpstashRedisEventLists {
  success: boolean,
  result: UpstashRedisEventList[]
  dataCounter: number;
}


export interface UpstashRedisBrowserData {
  key: string,
  size: string,
  ttl: string,
  type: string,
}

export interface GetUpstashRedisBrowserData {
  success: boolean,
  result: UpstashRedisBrowserData[]
  dataCounter: number;

}

