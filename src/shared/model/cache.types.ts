export interface Cache<D> {
  data: D[];
  lastUpdated: Date;
  pendingSync: D[];
  syncStatus: "idle" | "syncing" | "error";
}

export interface CacheConfig {
  maxSize?: number;
  ttl?: number;
  autoSync?: boolean;
  syncInterval?: number;
}

export interface CacheStats {
  totalItems: number;
  pendingSyncCount: number;
  lastSyncTime?: Date;
  syncStatus: "idle" | "syncing" | "error";
}
