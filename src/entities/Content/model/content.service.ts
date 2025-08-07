import { v4 as uuidv4 } from "uuid";
import { CacheManager } from "@/shared/model/cache.manager";
import { Content, ContentType } from "../lib/content.types";

export class ContentService implements ContentType {
  private storageKey: string;
  private cacheManager: CacheManager<Content>;
  constructor(storageKey: string = "memo-stack") {
    this.storageKey = storageKey;
    this.cacheManager = new CacheManager<Content>();
    this.initializeCache();
  }
  private initializeCache(): void {
    const items = this.getAllContents();
    items.forEach((item) => {
      this.cacheManager.set(item.id, item);
    });
  }
  createContent(data: Content): Content {
    this.cacheManager.set(data.id, data);
    this.saveContent(data);
    return data;
  }
  generateId(): string {
    return uuidv4();
  }
  saveContent(data: Content): void {
    const items = this.getAllContents();
    const itemIndex = items.findIndex((item) => item.id === data.id);
    if (itemIndex >= 0) {
      items[itemIndex] = {
        ...data,
        updatedAt: new Date(),
      };
    } else {
      items.push(data);
    }
    this.cacheManager.set(data.id, data);
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }
  getAllContents(): Content[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }
  loadContent(id: string): Content | null {
    const cached = this.cacheManager.get(id);
    if (cached) {
      return cached;
    }
    const items = this.getAllContents();
    const item = items.find((item) => item.id === id);
    if (item) {
      this.cacheManager.set(item.id, item);
    }
    return item || null;
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
