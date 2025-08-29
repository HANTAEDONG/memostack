import { prisma } from "@/shared/lib/prisma";
import { Result, AppError, ErrorType } from "@/shared/lib/Error/error-handler";

import {
  DashboardData,
  DashboardStats,
  DailyActivity,
  CategoryAnalysis,
  StatusAnalysis,
  TrendData,
  RecentActivity,
  ProductivityMetrics,
  GoalProgress,
  Insight,
  DashboardFilters,
  DashboardQueryOptions,
} from "../lib/dashboard.types";

export class DashboardService {
  static async getDashboardData(
    options: DashboardQueryOptions
  ): Promise<Result<DashboardData>> {
    try {
      const [
        stats,
        dailyActivity,
        categoryAnalysis,
        statusAnalysis,
        productivity,
        insights,
      ] = await Promise.all([
        this.getStats(options.filters),
        this.getDailyActivity(options.filters),
        this.getCategoryAnalysis(options.filters),
        this.getStatusAnalysis(options.filters),
        this.getProductivityMetrics(options.filters),
        this.getInsights(options.filters),
      ]);

      if (
        !stats.success ||
        !dailyActivity.success ||
        !categoryAnalysis.success ||
        !statusAnalysis.success ||
        !productivity.success ||
        !insights.success
      ) {
        return {
          success: false,
          error: new AppError(
            "대시보드 데이터 조회 실패",
            ErrorType.UNKNOWN,
            "DASHBOARD_ERROR",
            500
          ),
        } as Result<DashboardData>;
      }

      const dashboardData: DashboardData = {
        stats: stats.data,
        dailyActivity: dailyActivity.data,
        categoryAnalysis: categoryAnalysis.data,
        statusAnalysis: statusAnalysis.data,
        trends: {
          weekly: await this.getWeeklyTrends(options.filters),
          monthly: await this.getMonthlyTrends(options.filters),
        },
        calendar: dailyActivity.data,
        recent: await this.getRecentActivity(options.filters),
        productivity: productivity.data,
        goals: await this.getGoalProgress(options.filters),
        insights: insights.data,
        lastUpdated: new Date().toISOString(),
      };

      return {
        success: true,
        data: dashboardData,
        error: null,
      } as Result<DashboardData>;
    } catch (error) {
      return {
        success: false,
        error: new AppError(
          `대시보드 데이터 조회 실패: ${error}`,
          ErrorType.UNKNOWN,
          "DASHBOARD_ERROR",
          500
        ),
      } as Result<DashboardData>;
    }
  }

  static async getStats(
    filters: DashboardFilters
  ): Promise<Result<DashboardStats>> {
    try {
      const [totalPosts, todayPosts, thisWeekPosts, thisMonthPosts] =
        await Promise.all([
          this.getTotalPosts(filters),
          this.getTodayPosts(filters),
          this.getThisWeekPosts(filters),
          this.getThisMonthPosts(filters),
        ]);

      const totalWords = await this.getTotalWords(filters);
      const streak = await this.getCurrentStreak(filters);
      const completionRate = await this.getCompletionRate(filters);
      const totalCategories = await this.getTotalCategories(filters);

      const stats: DashboardStats = {
        totalPosts,
        todayPosts,
        thisWeekPosts,
        thisMonthPosts,
        averagePostsPerDay: totalPosts / 30, // 30일 기준
        totalWords,
        longestStreak: await this.getLongestStreak(filters),
        currentStreak: streak,
        completionRate,
        totalCategories,
      };

      return {
        success: true,
        data: stats,
        error: null,
      } as Result<DashboardStats>;
    } catch (error) {
      return {
        success: false,
        error: new AppError(
          `통계 조회 실패: ${error}`,
          ErrorType.UNKNOWN,
          "STATS_ERROR",
          500
        ),
      } as Result<DashboardStats>;
    }
  }

  static async getDailyActivity(
    filters: DashboardFilters
  ): Promise<Result<DailyActivity[]>> {
    try {
      const { start, end } = filters.dateRange;
      const startDate = new Date(start);
      const endDate = new Date(end);

      const posts = await prisma.post.findMany({
        where: {
          createdAt: { gte: startDate, lte: endDate },
          ...(filters.authorId && { authorId: filters.authorId }),
          ...(filters.categories.length > 0 && {
            category: { in: filters.categories },
          }),
          ...(filters.statuses.length > 0 && {
            status: { in: filters.statuses },
          }),
        },
        select: {
          createdAt: true,
          content: true,
          category: true,
        },
        orderBy: { createdAt: "asc" },
      });

      // 일별로 그룹화
      const dailyMap = new Map<string, DailyActivity>();

      for (
        let d = new Date(startDate);
        d <= endDate;
        d.setDate(d.getDate() + 1)
      ) {
        const dateKey = d.toISOString().split("T")[0];
        dailyMap.set(dateKey, {
          date: dateKey,
          postCount: 0,
          wordCount: 0,
          categories: [],
          intensity: 0,
        });
      }

      // 포스트 데이터로 일별 통계 계산
      posts.forEach((post) => {
        const dateKey = post.createdAt.toISOString().split("T")[0];
        const daily = dailyMap.get(dateKey);
        if (daily) {
          daily.postCount++;
          daily.wordCount += post.content.split(/\s+/).length;
          if (!daily.categories.includes(post.category)) {
            daily.categories.push(post.category);
          }
        }
      });

      // intensity 계산 (GitHub style)
      const activities = Array.from(dailyMap.values());
      const maxPosts = Math.max(...activities.map((d) => d.postCount));

      activities.forEach((activity) => {
        if (maxPosts === 0) {
          activity.intensity = 0;
        } else {
          const ratio = activity.postCount / maxPosts;
          if (ratio === 0) activity.intensity = 0;
          else if (ratio <= 0.25) activity.intensity = 1;
          else if (ratio <= 0.5) activity.intensity = 2;
          else if (ratio <= 0.75) activity.intensity = 3;
          else activity.intensity = 4;
        }
      });

      return {
        success: true,
        data: activities,
        error: null,
      } as Result<DailyActivity[]>;
    } catch (error) {
      return {
        success: false,
        error: new AppError(
          `일별 활동 조회 실패: ${error}`,
          ErrorType.UNKNOWN,
          "DAILY_ACTIVITY_ERROR",
          500
        ),
      } as Result<DailyActivity[]>;
    }
  }

  static async getCategoryAnalysis(
    filters: DashboardFilters
  ): Promise<Result<CategoryAnalysis[]>> {
    try {
      const { start, end } = filters.dateRange;
      const startDate = new Date(start);
      const endDate = new Date(end);

      const posts = await prisma.post.findMany({
        where: {
          createdAt: { gte: startDate, lte: endDate },
          ...(filters.authorId && { authorId: filters.authorId }),
          ...(filters.statuses.length > 0 && {
            status: { in: filters.statuses },
          }),
        },
        select: {
          category: true,
          content: true,
          status: true,
        },
      });

      // 카테고리별 통계 계산
      const categoryMap = new Map<
        string,
        { count: number; words: number; completed: number }
      >();

      posts.forEach((post) => {
        const existing = categoryMap.get(post.category) || {
          count: 0,
          words: 0,
          completed: 0,
        };
        existing.count++;
        existing.words += post.content.split(/\s+/).length;
        if (post.status === "Done") existing.completed++;
        categoryMap.set(post.category, existing);
      });

      const totalPosts = posts.length;
      const categoryAnalysis: CategoryAnalysis[] = Array.from(
        categoryMap.entries()
      ).map(([category, data]) => ({
        category,
        count: data.count,
        percentage: (data.count / totalPosts) * 100,
        growthRate: 0, // TODO: 전월 대비 계산
        avgWords: data.words / data.count,
        completionRate: (data.completed / data.count) * 100,
        color: this.getCategoryColor(category),
      }));

      return {
        success: true,
        data: categoryAnalysis,
        error: null,
      } as Result<CategoryAnalysis[]>;
    } catch (error) {
      return {
        success: false,
        error: new AppError(
          `카테고리 분석 실패: ${error}`,
          ErrorType.UNKNOWN,
          "CATEGORY_ANALYSIS_ERROR",
          500
        ),
      } as Result<CategoryAnalysis[]>;
    }
  }

  static async getStatusAnalysis(
    filters: DashboardFilters
  ): Promise<Result<StatusAnalysis[]>> {
    try {
      const { start, end } = filters.dateRange;
      const startDate = new Date(start);
      const endDate = new Date(end);

      const posts = await prisma.post.findMany({
        where: {
          createdAt: { gte: startDate, lte: endDate },
          ...(filters.authorId && { authorId: filters.authorId }),
          ...(filters.categories.length > 0 && {
            category: { in: filters.categories },
          }),
        },
        select: {
          status: true,
          createdAt: true,
        },
      });

      // 상태별 통계 계산
      const statusMap = new Map<
        string,
        { count: number; trend: "up" | "down" | "stable" }
      >();

      posts.forEach((post) => {
        const existing = statusMap.get(post.status) || {
          count: 0,
          trend: "stable",
        };
        existing.count++;
        statusMap.set(post.status, existing);
      });

      const totalPosts = posts.length;
      const statusAnalysis: StatusAnalysis[] = Array.from(
        statusMap.entries()
      ).map(([status, data]) => ({
        status,
        count: data.count,
        percentage: (data.count / totalPosts) * 100,
        color: this.getStatusColor(status),
        trend: data.trend,
      }));

      return {
        success: true,
        data: statusAnalysis,
        error: null,
      } as Result<StatusAnalysis[]>;
    } catch (error) {
      return {
        success: false,
        error: new AppError(
          `상태 분석 실패: ${error}`,
          ErrorType.UNKNOWN,
          "STATUS_ANALYSIS_ERROR",
          500
        ),
      } as Result<StatusAnalysis[]>;
    }
  }

  static async getProductivityMetrics(
    filters: DashboardFilters
  ): Promise<Result<ProductivityMetrics>> {
    try {
      const { start, end } = filters.dateRange;
      const startDate = new Date(start);
      const endDate = new Date(end);

      const posts = await prisma.post.findMany({
        where: {
          createdAt: { gte: startDate, lte: endDate },
          ...(filters.authorId && { authorId: filters.authorId }),
        },
        select: {
          content: true,
          createdAt: true,
        },
        orderBy: { createdAt: "asc" },
      });

      if (posts.length === 0) {
        return {
          success: true,
          data: {
            avgPostLength: 0,
            writingSpeed: 0,
            mostProductiveTime: "N/A",
            mostProductiveDay: "N/A",
            focusScore: 0,
          },
          error: null,
        } as Result<ProductivityMetrics>;
      }

      // 평균 포스트 길이
      const totalWords = posts.reduce(
        (sum, post) => sum + post.content.split(/\s+/).length,
        0
      );
      const avgPostLength = totalWords / posts.length;

      // 작성 시간대 분석
      const hourMap = new Map<number, number>();
      posts.forEach((post) => {
        const hour = post.createdAt.getHours();
        hourMap.set(hour, (hourMap.get(hour) || 0) + 1);
      });
      const mostProductiveTime =
        Array.from(hourMap.entries()).sort(([, a], [, b]) => b - a)[0]?.[0] ||
        0;

      // 요일별 분석
      const dayMap = new Map<number, number>();
      posts.forEach((post) => {
        const day = post.createdAt.getDay();
        dayMap.set(day, (dayMap.get(day) || 0) + 1);
      });
      const mostProductiveDay =
        Array.from(dayMap.entries()).sort(([, a], [, b]) => b - a)[0]?.[0] || 0;

      // Focus Score 계산 (작성 패턴 일관성)
      const daysDiff = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const focusScore = Math.min(100, (posts.length / daysDiff) * 100);

      const metrics: ProductivityMetrics = {
        avgPostLength: Math.round(avgPostLength),
        writingSpeed: Math.round(avgPostLength / 30), // 30분 작성 가정
        mostProductiveTime: `${mostProductiveTime}:00`,
        mostProductiveDay: this.getDayName(mostProductiveDay),
        focusScore: Math.round(focusScore),
      };

      return {
        success: true,
        data: metrics,
        error: null,
      } as Result<ProductivityMetrics>;
    } catch (error) {
      return {
        success: false,
        error: new AppError(
          `생산성 지표 조회 실패: ${error}`,
          ErrorType.UNKNOWN,
          "PRODUCTIVITY_ERROR",
          500
        ),
      } as Result<ProductivityMetrics>;
    }
  }

  static async getInsights(
    filters: DashboardFilters
  ): Promise<Result<Insight[]>> {
    try {
      const insights: Insight[] = [];

      // 연속 작성일 인사이트
      const currentStreak = await this.getCurrentStreak(filters);
      if (currentStreak > 0) {
        insights.push({
          type: "motivation",
          title: "🔥 연속 작성 중!",
          description: `${currentStreak}일째 연속으로 작성하고 있습니다.`,
          priority: "high",
        });
      } else if (currentStreak === 0) {
        insights.push({
          type: "suggestion",
          title: "📝 오늘 첫 글을 써보세요",
          description: "짧은 메모라도 좋습니다. 습관을 만들어보세요!",
          priority: "medium",
        });
      }

      // 카테고리 균형 인사이트
      const categoryAnalysis = await this.getCategoryAnalysis(filters);
      if (categoryAnalysis.success) {
        const topCategory = categoryAnalysis.data[0];
        if (topCategory && topCategory.percentage > 50) {
          insights.push({
            type: "pattern",
            title: "🎯 카테고리 집중",
            description: `${topCategory.category}에 집중하고 있습니다. 다른 주제도 탐험해보세요.`,
            priority: "medium",
          });
        }
      }

      // 생산성 인사이트
      const productivity = await this.getProductivityMetrics(filters);
      if (productivity.success) {
        if (productivity.data.focusScore > 80) {
          insights.push({
            type: "productivity",
            title: "🚀 높은 집중도",
            description: "일관된 작성 패턴을 유지하고 있습니다!",
            priority: "low",
          });
        }
      }

      return {
        success: true,
        data: insights,
        error: null,
      } as Result<Insight[]>;
    } catch (error) {
      return {
        success: false,
        error: new AppError(
          `인사이트 생성 실패: ${error}`,
          ErrorType.UNKNOWN,
          "INSIGHTS_ERROR",
          500
        ),
      } as Result<Insight[]>;
    }
  }

  // 헬퍼 메서드들
  private static async getTotalPosts(
    filters: DashboardFilters
  ): Promise<number> {
    const { start, end } = filters.dateRange;
    return await prisma.post.count({
      where: {
        createdAt: { gte: new Date(start), lte: new Date(end) },
        ...(filters.authorId && { authorId: filters.authorId }),
      },
    });
  }

  private static async getTodayPosts(
    filters: DashboardFilters
  ): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return await prisma.post.count({
      where: {
        createdAt: { gte: today },
        ...(filters.authorId && { authorId: filters.authorId }),
      },
    });
  }

  private static async getThisWeekPosts(
    filters: DashboardFilters
  ): Promise<number> {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    return await prisma.post.count({
      where: {
        createdAt: { gte: weekStart },
        ...(filters.authorId && { authorId: filters.authorId }),
      },
    });
  }

  private static async getThisMonthPosts(
    filters: DashboardFilters
  ): Promise<number> {
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    return await prisma.post.count({
      where: {
        createdAt: { gte: monthStart },
        ...(filters.authorId && { authorId: filters.authorId }),
      },
    });
  }

  private static async getTotalWords(
    filters: DashboardFilters
  ): Promise<number> {
    const { start, end } = filters.dateRange;
    const posts = await prisma.post.findMany({
      where: {
        createdAt: { gte: new Date(start), lte: new Date(end) },
        ...(filters.authorId && { authorId: filters.authorId }),
      },
      select: { content: true },
    });
    return posts.reduce(
      (sum, post) => sum + post.content.split(/\s+/).length,
      0
    );
  }

  private static async getCurrentStreak(
    filters: DashboardFilters
  ): Promise<number> {
    // TODO: 연속 작성일 계산 로직 구현
    return 0;
  }

  private static async getLongestStreak(
    filters: DashboardFilters
  ): Promise<number> {
    // TODO: 최장 연속 작성일 계산 로직 구현
    return 0;
  }

  private static async getCompletionRate(
    filters: DashboardFilters
  ): Promise<number> {
    const { start, end } = filters.dateRange;
    const [total, completed] = await Promise.all([
      prisma.post.count({
        where: {
          createdAt: { gte: new Date(start), lte: new Date(end) },
          ...(filters.authorId && { authorId: filters.authorId }),
        },
      }),
      prisma.post.count({
        where: {
          createdAt: { gte: new Date(start), lte: new Date(end) },
          status: "Done",
          ...(filters.authorId && { authorId: filters.authorId }),
        },
      }),
    ]);
    return total > 0 ? (completed / total) * 100 : 0;
  }

  private static async getTotalCategories(
    filters: DashboardFilters
  ): Promise<number> {
    const { start, end } = filters.dateRange;
    const categories = await prisma.post.findMany({
      where: {
        createdAt: { gte: new Date(start), lte: new Date(end) },
        ...(filters.authorId && { authorId: filters.authorId }),
      },
      select: { category: true },
      distinct: ["category"],
    });
    return categories.length;
  }

  private static async getWeeklyTrends(
    filters: DashboardFilters
  ): Promise<TrendData[]> {
    // TODO: 주간 트렌드 계산 로직 구현
    return [];
  }

  private static async getMonthlyTrends(
    filters: DashboardFilters
  ): Promise<TrendData[]> {
    // TODO: 월간 트렌드 계산 로직 구현
    return [];
  }

  private static async getRecentActivity(
    filters: DashboardFilters
  ): Promise<RecentActivity> {
    const { start, end } = filters.dateRange;
    const posts = await prisma.post.findMany({
      where: {
        createdAt: { gte: new Date(start), lte: new Date(end) },
        ...(filters.authorId && { authorId: filters.authorId }),
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        category: true,
        status: true,
        content: true,
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    const recentPosts = posts.map((post) => ({
      id: post.id,
      title: post.title,
      createdAt: post.createdAt.toISOString(),
      category: post.category,
      status: post.status,
      wordCount: post.content.split(/\s+/).length,
    }));

    // TODO: achievements 로직 구현
    const achievements: RecentActivity["achievements"] = [];

    return { posts: recentPosts, achievements };
  }

  private static async getGoalProgress(
    filters: DashboardFilters
  ): Promise<GoalProgress> {
    // TODO: 목표 진행률 계산 로직 구현
    return {
      monthlyTarget: 30,
      currentProgress: 0,
      completionPercentage: 0,
      streakTarget: 7,
      currentStreak: 0,
      categoryGoals: [],
    };
  }

  private static getCategoryColor(category: string): string {
    const colors = {
      프로그래밍: "#3B82F6",
      기술: "#10B981",
      일상: "#F59E0B",
      여행: "#8B5CF6",
      음식: "#EF4444",
      영화: "#EC4899",
      책: "#06B6D4",
      운동: "#84CC16",
      음악: "#F97316",
      게임: "#6366F1",
    };
    return colors[category as keyof typeof colors] || "#6B7280";
  }

  private static getStatusColor(status: string): string {
    const colors = {
      Done: "#10B981",
      "In Progress": "#F59E0B",
      "Not Started": "#6B7280",
      draft: "#6B7280",
    };
    return colors[status as keyof typeof colors] || "#6B7280";
  }

  private static getDayName(day: number): string {
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    return days[day] || "N/A";
  }
}
