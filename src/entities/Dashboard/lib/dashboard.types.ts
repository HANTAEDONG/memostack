// 기본 통계 지표
export interface DashboardStats {
  totalPosts: number;
  todayPosts: number;
  thisWeekPosts: number;
  thisMonthPosts: number;
  averagePostsPerDay: number;
  totalWords: number;
  longestStreak: number;
  currentStreak: number;
  completionRate: number;
  totalCategories: number;
}

// 일별 활동 데이터
export interface DailyActivity {
  date: string;
  postCount: number;
  wordCount: number;
  categories: string[];
  intensity: 0 | 1 | 2 | 3 | 4; // GitHub style heatmap
}

// 카테고리별 분석
export interface CategoryAnalysis {
  category: string;
  count: number;
  percentage: number;
  growthRate: number; // 전월 대비 증감률
  avgWords: number;
  completionRate: number;
  color: string;
}

// 상태별 분석
export interface StatusAnalysis {
  status: string;
  count: number;
  percentage: number;
  color: string;
  trend: "up" | "down" | "stable";
}

// 주간/월간 트렌드
export interface TrendData {
  period: string; // "2024-W01" or "2024-01"
  posts: number;
  completed: number;
  words: number;
  categories: string[];
}

// 최근 활동
export interface RecentActivity {
  posts: Array<{
    id: string;
    title: string;
    createdAt: string;
    category: string;
    status: string;
    wordCount: number;
  }>;
  achievements: Array<{
    type: "streak" | "milestone" | "category" | "completion";
    title: string;
    description: string;
    date: string;
    icon: string;
  }>;
}

// 생산성 지표
export interface ProductivityMetrics {
  avgPostLength: number;
  writingSpeed: number; // 단어/시간 (추정)
  mostProductiveTime: string;
  mostProductiveDay: string;
  focusScore: number; // 0-100, 작성 패턴 일관성
}

// 목표 달성 현황
export interface GoalProgress {
  monthlyTarget: number;
  currentProgress: number;
  completionPercentage: number;
  streakTarget: number;
  currentStreak: number;
  categoryGoals: Array<{
    category: string;
    target: number;
    current: number;
    percentage: number;
  }>;
}

// 인사이트 & 추천
export interface Insight {
  type: "productivity" | "pattern" | "motivation" | "suggestion";
  title: string;
  description: string;
  data?: Record<string, string | number | boolean>;
  priority: "low" | "medium" | "high";
}

// 대시보드 메인 데이터
export interface DashboardData {
  stats: DashboardStats;
  dailyActivity: DailyActivity[];
  categoryAnalysis: CategoryAnalysis[];
  statusAnalysis: StatusAnalysis[];
  trends: {
    weekly: TrendData[];
    monthly: TrendData[];
  };
  calendar: DailyActivity[];
  recent: RecentActivity;
  productivity: ProductivityMetrics;
  goals: GoalProgress;
  insights: Insight[];
  lastUpdated: string;
}

// 대시보드 설정
export interface DashboardConfig {
  refreshInterval: number; // 초 단위
  defaultPeriod: "7d" | "30d" | "90d" | "1y";
  enabledCharts: string[];
  theme: "light" | "dark" | "auto";
  layout: "grid" | "list" | "compact";
}

// 대시보드 필터
export interface DashboardFilters {
  dateRange: {
    start: string;
    end: string;
  };
  categories: string[];
  statuses: string[];
  authorId?: string;
}

// 대시보드 쿼리 옵션
export interface DashboardQueryOptions {
  filters: DashboardFilters;
  period: string;
  includeCharts: boolean;
  includeInsights: boolean;
  limit?: number;
}

export type DashboardServiceType = {
  getDashboardData(options: DashboardQueryOptions): Promise<DashboardData>;
  getStats(filters: DashboardFilters): Promise<DashboardStats>;
  getDailyActivity(filters: DashboardFilters): Promise<DailyActivity[]>;
  getCategoryAnalysis(filters: DashboardFilters): Promise<CategoryAnalysis[]>;
  getProductivityMetrics(
    filters: DashboardFilters
  ): Promise<ProductivityMetrics>;
  getInsights(filters: DashboardFilters): Promise<Insight[]>;
  refreshData(): Promise<void>;
};
