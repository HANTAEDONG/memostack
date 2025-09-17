import { Post } from "@prisma/client";
import { Category } from "./category.types";

// 정렬 관련 타입들
export type PostSortField = "createdAt" | "updatedAt" | "title" | "category";
export type SortOrder = "asc" | "desc";

// 쿼리 옵션 타입
export interface PostQueryOptions {
  limit?: number;
  offset?: number;
  sortBy?: PostSortField;
  sortOrder?: SortOrder;
  filters?: {
    category?: string;
    status?: string;
    authorId?: string;
    search?: string;
  };
}

// API 관련 타입들
export interface CreatePostData {
  title: string;
  content: string;
  category: Category;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  category?: Category;
  status?: string;
}

// UI 관련 타입들
export interface CreatePostFormProps {
  // 데이터
  title: string;
  content: string;
  category: Category;
  isSaving: boolean;
  isLoading: boolean;
  authLoading: boolean;
  isAuthenticated: boolean;
  lastSaved?: Date;
  saveError?: string;
  loadError?: string;

  // 이벤트 핸들러
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onCategoryChange: (category: Category) => void;
  onManualSave: () => Promise<boolean>;
  onClearDraft: () => void;
}

// 비즈니스 로직 관련 타입들
export interface EditPostValidationError {
  code: string;
  message: string;
}

// PostWithAuthor 타입 추가
export interface PostWithAuthor extends Post {
  author: {
    id: string;
    name: string | null;
    email: string;
    image?: string | null;
  };
}

// 기존 타입들 재export
export type { Post };
