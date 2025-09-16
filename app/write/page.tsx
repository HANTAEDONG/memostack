import { Suspense } from "react";
import CreatePostFormContainer from "@/features/EditPost/containers/CreatePostFormContainer";

interface WritePageProps {
  searchParams?: Promise<{
    id?: string;
  }>;
}

function WriteContent({ postId }: { postId?: string }) {
  return (
    <div className="w-full h-full min-h-screen px-4 max-sm:px-0 bg-background">
      <CreatePostFormContainer postId={postId} />
    </div>
  );
}

export default async function Write({ searchParams }: WritePageProps) {
  const resolvedSearchParams = await searchParams;
  const postId = resolvedSearchParams?.id;

  return (
    <Suspense
      fallback={
        <div className="w-full h-full min-h-screen px-4 max-sm:px-0 bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <div className="text-gray-600">로딩 중...</div>
          </div>
        </div>
      }
    >
      <WriteContent postId={postId} />
    </Suspense>
  );
}
