import PostListPage from "@/pages/postListPage";
import { PostSortField, SortOrder } from "@/entities/Post/lib/post.types";

interface DashboardProps {
  searchParams?: {
    sortBy?: PostSortField;
    sortOrder?: SortOrder;
    category?: string;
    status?: string;
    search?: string;
  };
}

export default function Dashboard({ searchParams }: DashboardProps) {
  return (
    <div className="w-full">
      <PostListPage searchParams={searchParams} />
    </div>
  );
}
