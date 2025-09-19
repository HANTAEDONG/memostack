"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/shared/ui/shadcn/input";
import { Category, CATEGORY_LABELS } from "../lib/category.types";

interface CategoryAutocompleteInputProps {
  value: Category;
  onValueChange: (value: Category) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export default function CategoryAutocompleteInput({
  value,
  onValueChange,
  disabled,
  placeholder = "카테고리",
  className = "",
}: CategoryAutocompleteInputProps) {
  const [inputValue, setInputValue] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 입력값에 따라 필터링된 카테고리 목록 생성
  const filteredCategories = Object.entries(CATEGORY_LABELS).filter(
    ([, label]) => label.toLowerCase().includes(inputValue.toLowerCase())
  );

  // 입력값이 변경될 때
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  // 카테고리 선택 시
  const handleCategorySelect = (categoryValue: Category, label: string) => {
    setInputValue(label);
    onValueChange(categoryValue);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  // 키보드 네비게이션
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
        return;
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredCategories.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredCategories.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredCategories[highlightedIndex]) {
          const [categoryValue, label] = filteredCategories[highlightedIndex];
          handleCategorySelect(categoryValue as Category, label);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // 포커스 시 드롭다운 열기
  const handleFocus = () => {
    setIsOpen(true);
  };

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // value prop이 변경될 때 inputValue 업데이트 (카테고리가 선택된 경우에만)
  useEffect(() => {
    const label = value
      ? CATEGORY_LABELS[value as keyof typeof CATEGORY_LABELS]
      : undefined;
    setInputValue(label || "");
  }, [value]);

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
          카테고리:
        </span>
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          disabled={disabled}
          placeholder={placeholder}
          className={`${className} ${
            isOpen ? "rounded-b-none" : ""
          } hover:border-gray-300 dark:hover:border-gray-600 transition-colors`}
          autoComplete="off"
        />
      </div>

      {isOpen && filteredCategories.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 border-t-0 rounded-b-md shadow-lg max-h-60 overflow-y-auto"
          style={{ top: "100%", left: 0 }}
        >
          {filteredCategories.map(([categoryValue, label], index) => (
            <div
              key={categoryValue}
              className={`px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${
                index === highlightedIndex ? "bg-gray-100 dark:bg-gray-700" : ""
              } ${
                categoryValue === value && value !== ""
                  ? "bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                  : ""
              } text-gray-900 dark:text-gray-100 hover:scale-[1.02] transform`}
              onClick={() =>
                handleCategorySelect(categoryValue as Category, label)
              }
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              {label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
