import PostList from "@/features/PostList/ui/PostList";
import { PostSortField, SortOrder } from "@/entities/Post/lib/post.types";

interface DashboardProps {
  searchParams?: Promise<{
    sortBy?: PostSortField;
    sortOrder?: SortOrder;
    category?: string;
    status?: string;
    search?: string;
  }>;
}

export default async function Dashboard({ searchParams }: DashboardProps) {
  const resolvedSearchParams = await searchParams;
  return (
    <div className="w-full">
      <PostList searchParams={resolvedSearchParams} />
    </div>
  );
}
