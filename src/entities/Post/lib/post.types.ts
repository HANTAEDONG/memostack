import { ApiResponse } from "@/shared/lib/Error/error-handler";
import { Post, User } from "@prisma/client";

// export interface CreatePostData {
//   id: string;
//   title: string;
//   content: string;
//   authorId: string;
//   category?: string;
//   status?: string;
//   createdAt: string;
//   updatedAt: string;
// }

export interface UpdatePostData {
  title?: string;
  content?: string;
  category?: string;
  status?: string;
}

export interface PostWithAuthor extends Post {
  author: User;
}

export interface PostFilters {
  category?: string;
  authorId?: string;
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: PostSortField;
  sortOrder?: SortOrder;
}
export type PostSortField =
  | "title"
  | "category"
  | "status"
  | "createdAt"
  | "updatedAt";
export type SortOrder = "asc" | "desc";

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

export type PostServiceType = {
  postDraft(postData: Post): Promise<ApiResponse<Post>>;
  findById(id: string): Promise<ApiResponse<PostWithAuthor | null>>;
  findAll(options?: PostQueryOptions): Promise<ApiResponse<PostWithAuthor[]>>;
  findByAuthor(
    authorId: string,
    options?: PostQueryOptions
  ): Promise<ApiResponse<Post[]>>;
  update(
    id: string,
    updateData: UpdatePostData,
    authorId: string
  ): Promise<ApiResponse<Post>>;
  delete(id: string, authorId: string): Promise<ApiResponse<boolean>>;
  search(
    query: string,
    options?: PostQueryOptions
  ): Promise<ApiResponse<PostWithAuthor[]>>;
  count(authorId?: string): Promise<ApiResponse<number>>;
};
