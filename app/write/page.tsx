import { Suspense } from "react";
import CreatePostFormContainer from "@/features/EditPost/containers/CreatePostFormContainer";

function WriteContent() {
  return (
    <div className="w-full h-full min-h-screen px-4 max-sm:px-0 bg-background">
      <CreatePostFormContainer />
    </div>
  );
}

export default function Write() {
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
      <WriteContent />
    </Suspense>
  );
}
