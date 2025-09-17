import { DataTable } from "@/shared/ui/data-table";
import { PostService } from "@/entities/Post";
import { PostSortField, SortOrder } from "@/entities/Post/lib/post.types";
import CategoryFilter from "./CategoryFilter";

interface PostListProps {
  searchParams?: {
    sortBy?: PostSortField;
    sortOrder?: SortOrder;
    category?: string;
    status?: string;
    search?: string;
  };
}

interface TransformedPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  category: string;
  status: string;
}

const PostList = async ({ searchParams = {} }: PostListProps) => {
  const {
    sortBy = "updatedAt",
    sortOrder = "desc",
    category,
    status,
    search,
  } = searchParams;

  try {
    const result = await PostService.findAll({
      limit: 50,
      sortBy,
      sortOrder,
      filters: {
        category,
        status,
        search,
      },
    });

    if (!result.success) {
      return (
        <div className="p-4 text-center">
          <p className="text-red-500">
            데이터를 불러오는데 실패했습니다: {result.error.message}
          </p>
        </div>
      );
    }

    // PostWithAuthor 데이터를 DataTable이 기대하는 형식으로 변환
    const posts: TransformedPost[] = (result.data || []).map((post) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      authorId: post.authorId,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      category: post.category,
      status: post.status,
    }));

    return (
      <div className="space-y-4">
        <CategoryFilter />
        <DataTable data={posts} />
      </div>
    );
  } catch (error) {
    console.error("포스트 가져오기 실패:", error);
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">서버 오류가 발생했습니다.</p>
      </div>
    );
  }
};

export default PostList;
