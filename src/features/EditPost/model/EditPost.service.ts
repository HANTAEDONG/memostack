import { Content, ContentService } from "@/entities/Content";
import extractTitleFromContent from "@/shared/lib/extractTitleFromContent";

export class EditPostService {
  private contentService: ContentService;
  constructor() {
    this.contentService = new ContentService();
  }
  createContent(content: string): Content {
    const newContentData: Content = {
      id: this.contentService.generateId(),
      title: extractTitleFromContent(content),
      content: content,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return this.contentService.createContent(newContentData);
  }
  saveContent(contentToSave: string, currentContentId?: string): Content {
    if (currentContentId) {
      const savedContent: Content = {
        id: currentContentId,
        title: extractTitleFromContent(contentToSave),
        content: contentToSave,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.contentService.saveContent(savedContent);
      return savedContent;
    } else {
      return this.createContent(contentToSave);
    }
  }
}
