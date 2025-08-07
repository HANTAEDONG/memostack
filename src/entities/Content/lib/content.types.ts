export interface Identifiable {
  id: string;
}

export interface Content extends Identifiable {
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContentType {
  saveContent(data: Content): void;
  createContent(data: Content): Content;
  loadContent(id: string): Content | null;
  getAllContents(): Content[];
  deleteContent(id: string): void;
  clearAll(): void;
  generateId(): string;
}
