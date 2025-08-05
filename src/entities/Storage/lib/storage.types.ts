export interface SavedContent {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StorageConfig {
  autoSaveInterval: number;
  maxDrafts: number;
  storageKey: string;
}

export interface StorageStats {
  totalItems: number;
  totalSize: number;
  lastCleanup: Date;
}
