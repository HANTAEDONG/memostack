export interface SavedContent {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Identifiable {
  id: string;
}

export interface StorageServiceType<T extends Identifiable> {
  saveContent(data: T): void;
  createContent(data: T): T;
  getAllContents(): T[];
  deleteContent(id: string): void;
  clearAll(): void;
}
