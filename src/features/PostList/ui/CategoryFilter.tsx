"use client";

import { useRouter, useSearchParams } from "next/navigation";
import CategorySelect from "@/entities/Post/ui/CategorySelect";
import { CATEGORIES, Category } from "@/entities/Post/lib/category.types";
import { Button } from "@/shared/ui/shadcn/button";

export default function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory =
    (searchParams?.get("category") as Category) || CATEGORIES.GENERAL;

  const handleCategoryChange = (newCategory: Category) => {
    const params = new URLSearchParams(searchParams?.toString() || "");

    if (newCategory === CATEGORIES.GENERAL) {
      params.delete("category");
    } else {
      params.set("category", newCategory);
    }

    router.push(`?${params.toString()}`);
  };

  const handleClearFilter = () => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.delete("category");
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">
          카테고리 필터:
        </span>
        <CategorySelect
          value={currentCategory}
          onValueChange={handleCategoryChange}
        />
      </div>
      {currentCategory !== CATEGORIES.GENERAL && (
        <Button variant="outline" size="sm" onClick={handleClearFilter}>
          필터 초기화
        </Button>
      )}
    </div>
  );
}
