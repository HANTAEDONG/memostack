"use client";

import { CATEGORY_LABELS, Category } from "../lib/category.types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/shadcn/select";

interface CategoryInlineSelectProps {
  value: Category;
  onValueChange: (value: Category) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export default function CategoryInlineSelect({
  value,
  onValueChange,
  disabled,
  placeholder = "카테고리",
  className = "",
}: CategoryInlineSelectProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-base font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
          카테고리:
        </span>
        <Select
          value={value || undefined}
          onValueChange={(v) => onValueChange(v as Category)}
          disabled={disabled}
        >
          <SelectTrigger className="w-[180px] h-8 text-sm">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Object.entries(CATEGORY_LABELS).map(([categoryValue, label]) => (
                <SelectItem key={categoryValue} value={categoryValue}>
                  {label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
