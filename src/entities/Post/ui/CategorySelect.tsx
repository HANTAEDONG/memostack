"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/shadcn/select";
import { CATEGORY_LABELS, Category } from "../lib/category.types";

interface CategorySelectProps {
  value: Category;
  onValueChange: (value: Category) => void;
  disabled?: boolean;
}

export default function CategorySelect({
  value,
  onValueChange,
  disabled,
}: CategorySelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="카테고리 선택" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(CATEGORY_LABELS).map(([categoryValue, label]) => (
          <SelectItem key={categoryValue} value={categoryValue}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
