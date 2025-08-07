import { v4 as uuidv4 } from "uuid";
import { CacheManager } from "@/shared/model/cache.manager";
import { Identifiable, StorageServiceType } from "../lib/storage.types";

export class StorageService<T extends Identifiable>
  implements StorageServiceType<T>
{
  private storageKey: string;
  private cacheManager: CacheManager<T>;
  constructor(storageKey: string = "storage") {
    this.storageKey = storageKey;
    this.cacheManager = new CacheManager<T>();
    this.initializeCache();
  }
  private initializeCache(): void {
    const items = this.getAll();
    items.forEach((item) => {
      this.cacheManager.set(item.id, item);
    });
  }
  create(data: T): T {
    this.cacheManager.set(data.id, data);
    this.save(data);
    return data;
  }
  generateId(): string {
    return uuidv4();
  }
  save(data: T): void {
    const items = this.getAll();
    const itemIndex = items.findIndex((item) => item.id === data.id);
    if (itemIndex >= 0) {
      items[itemIndex] = {
        ...data,
      };
    } else {
      items.push(data);
    }
    this.cacheManager.set(data.id, data);
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }
  getAll(): T[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }
  delete(id: string): void {
    const items = this.getAll();
    const filtered = items.filter((item) => item.id !== id);
    this.cacheManager.delete(id);
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
  }
  clear(): void {
    localStorage.removeItem(this.storageKey);
    this.cacheManager.clear();
  }
}
