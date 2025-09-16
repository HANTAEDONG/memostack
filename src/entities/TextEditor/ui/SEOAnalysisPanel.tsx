"use client";

import { useState } from "react";
import { SEOAnalysisResult } from "@/entities/Ai/model/seo-analyzer.service";

import {
  Search,
  TrendingUp,
  Target,
  Lightbulb,
  Clock,
  BarChart3,
  CheckCircle,
  AlertCircle,
  XCircle,
  Loader2,
} from "lucide-react";

interface SEOAnalysisPanelProps {
  title: string;
  content: string;
  targetKeywords?: string[];
}

export const SEOAnalysisPanel = ({
  title,
  content,
  targetKeywords = [],
}: SEOAnalysisPanelProps) => {
  const [analysisResult, setAnalysisResult] =
    useState<SEOAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeSEO = async () => {
    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 입력해주세요.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    try {
      const response = await fetch("/api/ai/seo-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          targetKeywords,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }
      setAnalysisResult(result);
    } catch (err) {
      setError("SEO 분석 중 오류가 발생했습니다. 다시 시도해주세요.");
      console.error("SEO 분석 오류:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A":
        return "text-green-600 bg-green-100";
      case "B":
        return "text-blue-600 bg-blue-100";
      case "C":
        return "text-yellow-600 bg-yellow-100";
      case "D":
        return "text-orange-600 bg-orange-100";
      case "F":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "medium":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "low":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-200 bg-red-50";
      case "medium":
        return "border-yellow-200 bg-yellow-50";
      case "low":
        return "border-green-200 bg-green-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Search className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          SEO 분석
        </h3>
      </div>

      {/* 분석 버튼 */}
      <button
        onClick={analyzeSEO}
        disabled={isAnalyzing || !title.trim() || !content.trim()}
        className="w-full mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            분석 중...
          </>
        ) : (
          <>
            <TrendingUp className="w-4 h-4" />
            SEO 분석 시작
          </>
        )}
      </button>

      {/* 에러 메시지 */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* 분석 결과 */}
      {analysisResult && (
        <div className="space-y-6">
          {/* 전체 점수 */}
          <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {analysisResult.score}
            </div>
            <div
              className={`inline-block px-4 py-2 rounded-full text-lg font-semibold ${getGradeColor(
                analysisResult.grade
              )}`}
            >
              등급: {analysisResult.grade}
            </div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {analysisResult.summary}
            </p>
          </div>

          {/* 세부 점수 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <BarChart3 className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {analysisResult.contentScore}
              </div>
              <div className="text-sm text-gray-600">콘텐츠 품질</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {analysisResult.technicalScore}
              </div>
              <div className="text-sm text-gray-600">기술적 SEO</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Clock className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {analysisResult.readabilityScore}
              </div>
              <div className="text-sm text-gray-600">가독성</div>
            </div>
          </div>

          {/* 개선 제안 */}
          {analysisResult.improvements.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                개선 제안
              </h4>
              <div className="space-y-3">
                {analysisResult.improvements.map((improvement, index) => (
                  <div
                    key={index}
                    className={`p-4 border rounded-lg ${getPriorityColor(
                      improvement.priority
                    )}`}
                  >
                    <div className="flex items-start gap-3">
                      {getPriorityIcon(improvement.priority)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {improvement.category}
                          </span>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              improvement.priority === "high"
                                ? "bg-red-100 text-red-700"
                                : improvement.priority === "medium"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {improvement.priority === "high"
                              ? "높음"
                              : improvement.priority === "medium"
                              ? "보통"
                              : "낮음"}
                          </span>
                        </div>
                        <p className="text-gray-800 mb-2">
                          {improvement.description}
                        </p>
                        <div className="bg-white dark:bg-gray-700 p-3 rounded border">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            <strong>제안:</strong> {improvement.suggestion}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            <strong>영향:</strong> {improvement.impact}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 키워드 분석 */}
          {analysisResult.keywordAnalysis && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                키워드 분석
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h5 className="font-medium text-gray-700 mb-2">
                    주요 키워드
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.keywordAnalysis.primaryKeywords.map(
                      (keyword, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded"
                        >
                          {keyword}
                        </span>
                      )
                    )}
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h5 className="font-medium text-gray-700 mb-2">
                    보조 키워드
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.keywordAnalysis.secondaryKeywords.map(
                      (keyword, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded"
                        >
                          {keyword}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>

              {analysisResult.keywordAnalysis.keywordGaps.length > 0 && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h5 className="font-medium text-yellow-800 mb-2">
                    누락된 키워드
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.keywordAnalysis.keywordGaps.map(
                      (keyword, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-yellow-100 text-yellow-800 text-sm rounded"
                        >
                          {keyword}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SEOAnalysisPanel;
