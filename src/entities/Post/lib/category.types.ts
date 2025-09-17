// 카테고리 관련 타입 정의

export const CATEGORIES = {
  GENERAL: "general",
  TECHNOLOGY: "technology", 
  LIFESTYLE: "lifestyle",
  TRAVEL: "travel",
  FOOD: "food",
  BOOKS: "books",
  MOVIES: "movies",
  MUSIC: "music",
  SPORTS: "sports",
  BUSINESS: "business",
  EDUCATION: "education",
  HEALTH: "health",
  OTHER: "other"
} as const;

export const CATEGORY_LABELS = {
  [CATEGORIES.GENERAL]: "일반",
  [CATEGORIES.TECHNOLOGY]: "기술",
  [CATEGORIES.LIFESTYLE]: "라이프스타일", 
  [CATEGORIES.TRAVEL]: "여행",
  [CATEGORIES.FOOD]: "음식",
  [CATEGORIES.BOOKS]: "책",
  [CATEGORIES.MOVIES]: "영화",
  [CATEGORIES.MUSIC]: "음악",
  [CATEGORIES.SPORTS]: "스포츠",
  [CATEGORIES.BUSINESS]: "비즈니스",
  [CATEGORIES.EDUCATION]: "교육",
  [CATEGORIES.HEALTH]: "건강",
  [CATEGORIES.OTHER]: "기타"
} as const;

export type Category = typeof CATEGORIES[keyof typeof CATEGORIES];

export interface CategoryOption {
  value: Category;
  label: string;
}

export const CATEGORY_OPTIONS: CategoryOption[] = Object.entries(CATEGORY_LABELS).map(
  ([value, label]) => ({
    value: value as Category,
    label
  })
);
