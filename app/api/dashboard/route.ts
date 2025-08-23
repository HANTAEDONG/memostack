import { NextRequest, NextResponse } from "next/server";
import { DashboardService } from "@/entities/Dashboard";
import { auth } from "@/shared/lib/nextAuth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "로그인이 필요합니다",
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30d";
    const includeCharts = searchParams.get("includeCharts") !== "false";
    const includeInsights = searchParams.get("includeInsights") !== "false";
    const limit = parseInt(searchParams.get("limit") || "50");

    const endDate = new Date();
    const startDate = new Date();

    switch (period) {
      case "7d":
        startDate.setDate(endDate.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(endDate.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(endDate.getDate() - 90);
        break;
      case "1y":
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(endDate.getDate() - 30);
    }

    const dashboardData = await DashboardService.getDashboardData({
      filters: {
        dateRange: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
        },
        categories: [],
        statuses: [],
        authorId: session.user.id,
      },
      period,
      includeCharts,
      includeInsights,
      limit,
    });

    if (!dashboardData.success) {
      return NextResponse.json(
        {
          success: false,
          message: dashboardData.error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: dashboardData.data,
      meta: {
        period,
        dateRange: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
        },
        includeCharts,
        includeInsights,
        limit,
      },
    });
  } catch (error) {
    console.error("대시보드 데이터 조회 실패:", error);
    return NextResponse.json(
      {
        success: false,
        message: "서버 오류가 발생했습니다",
      },
      { status: 500 }
    );
  }
}
