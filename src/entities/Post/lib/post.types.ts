export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  category: string;
  status: string;
}

export interface CreatePostInput {
  title: string;
  content: string;
  authorId: string;
  category?: string;
  status?: string;
}

export interface UpdatePostInput {
  title?: string;
  content?: string;
  category?: string;
}

export interface PostFilters {
  category?: string;
  authorId?: string;
  search?: string;
  limit?: number;
  offset?: number;
}
