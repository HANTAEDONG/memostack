import { Cache, CacheConfig, CacheStats } from "./cache.types";

interface Identifiable {
  id: string;
}

export class CacheManager<D extends Identifiable> {
  private cache: Cache<D>;
  private config: CacheConfig;

  constructor(config: CacheConfig = {}) {
    this.config = {
      maxSize: 1000,
      ttl: 24 * 60 * 60 * 1000,
      autoSync: false,
      syncInterval: 5000,
      ...config,
    };
    this.cache = {
      data: [],
      lastUpdated: new Date(),
      pendingSync: [],
      syncStatus: "idle",
    };
  }

  set(key: string, data: D): void {
    const existingIndex = this.cache.data.findIndex((item) => item.id === key);
    if (existingIndex >= 0) {
      this.cache.data[existingIndex] = data;
    } else {
      if (this.cache.data.length >= (this.config.maxSize || 1000)) {
        this.cache.data.shift();
      }
      this.cache.data.push(data);
    }
    this.cache.lastUpdated = new Date();
    this.addToPendingSync(data);
  }

  get(key: string): D | null {
    return this.cache.data.find((item) => item.id === key) || null;
  }

  getAll(): D[] {
    return [...this.cache.data];
  }

  delete(key: string): void {
    this.cache.data = this.cache.data.filter((item) => item.id !== key);
    this.cache.pendingSync = this.cache.pendingSync.filter(
      (item) => item.id !== key
    );
    this.cache.lastUpdated = new Date();
  }

  clear(): void {
    this.cache.data = [];
    this.cache.pendingSync = [];
    this.cache.lastUpdated = new Date();
    this.cache.syncStatus = "idle";
  }

  private addToPendingSync(data: D): void {
    const existingIndex = this.cache.pendingSync.findIndex(
      (item) => item.id === data.id
    );

    if (existingIndex >= 0) {
      this.cache.pendingSync[existingIndex] = data;
    } else {
      this.cache.pendingSync.push(data);
    }
  }

  getPendingSync(): D[] {
    return [...this.cache.pendingSync];
  }

  markSyncComplete(items: D[]): void {
    const itemIds = items.map((item) => item.id);
    this.cache.pendingSync = this.cache.pendingSync.filter(
      (item) => !itemIds.includes(item.id)
    );
    this.cache.syncStatus = "idle";
  }

  setSyncStatus(status: "idle" | "syncing" | "error"): void {
    this.cache.syncStatus = status;
  }

  getStats(): CacheStats {
    return {
      totalItems: this.cache.data.length,
      pendingSyncCount: this.cache.pendingSync.length,
      lastSyncTime: this.cache.lastUpdated,
      syncStatus: this.cache.syncStatus,
    };
  }

  isValid(): boolean {
    if (!this.config.ttl) return true;
    const now = new Date();
    const diff = now.getTime() - this.cache.lastUpdated.getTime();
    return diff < this.config.ttl;
  }

  refresh(): void {
    this.cache.lastUpdated = new Date();
  }
}
