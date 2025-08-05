import { v4 as uuidv4 } from "uuid";
import { SavedContent } from "../lib/storage.types";

interface StorageServiceType {
  saveContent(content: SavedContent): void;
  loadContent(id: string): SavedContent | null;
  getAllContents(): SavedContent[];
  deleteContent(id: string): void;
  clearAll(): void;
  saveDraft(content: string, id?: string, title?: string): SavedContent;
  loadDraft(id: string): string;
  setCurrentDraft(id: string): void;
  getCurrentDraftId(): string | null;
  generateId(): string;
  extractTitleFromContent(content: string): string;
}

export class StorageService implements StorageServiceType {
  private storageKey: string;
  private currentDraftId: string | null = null;
  constructor(storageKey: string = "memo-stack") {
    this.storageKey = storageKey;
  }
  createDraft(): SavedContent {
    const newDraft: SavedContent = {
      id: this.generateId(),
      title: "새 문서",
      content: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.currentDraftId = newDraft.id;
    this.saveContent(newDraft);
    return newDraft;
  }
  saveDraft(content: string, id?: string, title?: string): SavedContent {
    let draftId: string;
    if (id) {
      draftId = id;
    } else if (this.currentDraftId) {
      draftId = this.currentDraftId;
    } else {
      draftId = this.generateId();
      this.currentDraftId = draftId;
    }
    const savedContent: SavedContent = {
      id: draftId,
      title: title || this.extractTitleFromContent(content),
      content: content,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.saveContent(savedContent);
    return savedContent;
  }
  setCurrentDraft(id: string): void {
    this.currentDraftId = id;
  }
  getCurrentDraftId(): string | null {
    return this.currentDraftId;
  }
  generateId(): string {
    return uuidv4();
  }
  extractTitleFromContent(content: string): string {
    const lines = content.split("\n");
    const firstLine = lines[0].trim();
    return firstLine.length > 0 && firstLine.length <= 50
      ? firstLine
      : "Untitled";
  }
  saveContent(content: SavedContent): void {
    const items = this.getAllContents();
    const itemIndex = items.findIndex((item) => item.id === content.id);
    if (itemIndex >= 0) {
      items[itemIndex] = {
        ...content,
        title:
          content.title || this.extractTitleFromContent(content.content || ""),
        content: content.content || "",
        updatedAt: new Date(),
      };
    } else {
      items.push(content);
    }
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }
  getAllContents(): SavedContent[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }
  loadContent(id: string): SavedContent | null {
    const items = this.getAllContents();
    return items.find((item) => item.id === id) || null;
  }
  deleteContent(id: string): void {
    const items = this.getAllContents();
    const filtered = items.filter((item) => item.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
  }
  clearAll(): void {
    localStorage.removeItem(this.storageKey);
  }
  loadDraft(id: string): string {
    const content = this.loadContent(id);
    if (!content) {
      throw new Error(`Draft with id ${id} not found`);
    }
    return content.content || "";
  }
}
