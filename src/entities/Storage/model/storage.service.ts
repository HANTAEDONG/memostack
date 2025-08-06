import { CacheManager } from "@/shared/model/cache.manager";
import { Identifiable, StorageServiceType } from "../lib/storage.types";

export class StorageService<T extends Identifiable>
  implements StorageServiceType<T>
{
  private storageKey: string;
  private cacheManager: CacheManager<T>;
  constructor(storageKey: string = "memo-stack") {
    this.storageKey = storageKey;
    this.cacheManager = new CacheManager<T>();
    this.initializeCache();
  }
  private initializeCache(): void {
    const items = this.getAllContents();
    items.forEach((item) => {
      this.cacheManager.set(item.id, item);
    });
  }
  createContent(data: T): T {
    this.cacheManager.set(data.id, data);
    this.saveContent(data);
    return data;
  }
  saveContent(data: T): void {
    const items = this.getAllContents();
    const itemIndex = items.findIndex((item) => item.id === data.id);
    if (itemIndex >= 0) {
      items[itemIndex] = {
        ...data,
        updatedAt: new Date(),
      } as T;
    } else {
      items.push(data);
    }
    this.cacheManager.set(data.id, data);
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }
  getAllContents(): T[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }
  deleteContent(id: string): void {
    const items = this.getAllContents();
    const filtered = items.filter((item) => item.id !== id);
    this.cacheManager.delete(id);
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
  }
  clearAll(): void {
    localStorage.removeItem(this.storageKey);
    this.cacheManager.clear();
  }
}
