export interface Identifiable {
  id: string;
}

export interface StorageServiceType<T extends Identifiable> {
  save(data: T): void;
  create(data: T): T;
  getAll(): T[];
  delete(id: string): void;
  clear(): void;
  generateId(): string;
}
