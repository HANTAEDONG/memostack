import { AIService } from "./ai.service";

export interface SEOAnalysisResult {
  score: number; // 0-100 점수
  grade: "A" | "B" | "C" | "D" | "F"; // 등급
  summary: string; // 전체 요약
  improvements: SEOImprovement[]; // 개선 제안 목록
  keywordAnalysis: KeywordAnalysis; // 키워드 분석
  readabilityScore: number; // 가독성 점수
  technicalScore: number; // 기술적 SEO 점수
  contentScore: number; // 콘텐츠 품질 점수
}

export interface SEOImprovement {
  category: "title" | "content" | "keywords" | "structure" | "technical";
  priority: "high" | "medium" | "low";
  description: string;
  suggestion: string;
  impact: string; // SEO에 미치는 영향
}

export interface KeywordAnalysis {
  primaryKeywords: string[];
  secondaryKeywords: string[];
  keywordDensity: Record<string, number>;
  keywordGaps: string[]; // 누락된 키워드
  keywordOpportunities: string[]; // 추가하면 좋은 키워드
}

export class SEOAnalyzerService {
  private aiService: AIService;

  constructor() {
    // API 키를 전달하여 AIService 초기화
    const apiKey =
      typeof window === "undefined"
        ? process.env.OPENAI_API_KEY
        : process.env.NEXT_PUBLIC_OPENAI_API_KEY;

    this.aiService = new AIService(apiKey);
  }

  /**
   * 전체 SEO 분석 수행
   */
  async analyzeSEO(
    title: string,
    content: string,
    targetKeywords: string[] = []
  ): Promise<SEOAnalysisResult> {
    try {
      const analysisPrompt = this.createAnalysisPrompt(
        title,
        content,
        targetKeywords
      );

      const response = await this.aiService.createChatCompletion([
        {
          role: "system",
          content: `당신은 SEO 전문가입니다. 블로그 포스트의 SEO를 분석하고 점수를 매기며 구체적인 개선 제안을 해주세요.
          응답은 반드시 다음 JSON 형식으로 제공해야 합니다:
          {
            "score": 85,
            "grade": "B",
            "summary": "전체적으로 좋은 SEO를 보여주지만 몇 가지 개선점이 있습니다.",
            "improvements": [
              {
                "category": "title",
                "priority": "high",
                "description": "제목이 너무 길어 검색 결과에서 잘릴 수 있습니다.",
                "suggestion": "제목을 60자 이내로 줄이세요.",
                "impact": "검색 결과 클릭률 향상"
              }
            ],
            "keywordAnalysis": {
              "primaryKeywords": ["주요키워드1", "주요키워드2"],
              "secondaryKeywords": ["보조키워드1", "보조키워드2"],
              "keywordDensity": {"키워드1": 2.5},
              "keywordGaps": ["누락된키워드1"],
              "keywordOpportunities": ["추가하면좋은키워드1"]
            },
            "readabilityScore": 75,
            "technicalScore": 80,
            "contentScore": 85
          }`,
        },
        {
          role: "user",
          content: analysisPrompt,
        },
      ]);

      // JSON 파싱 시도
      try {
        const result = JSON.parse(response.content);
        return this.validateAndFormatResult(result);
      } catch (parseError) {
        console.error("SEO 분석 결과 파싱 실패:", parseError);

        return this.createDefaultResult();
      }
    } catch (error) {
      console.error("SEO 분석 중 오류 발생:", error);
      return this.createDefaultResult();
    }
  }

  /**
   * 제목 SEO 분석
   */
  async analyzeTitle(
    title: string,
    targetKeywords: string[] = []
  ): Promise<{
    score: number;
    suggestions: string[];
    optimalLength: number;
  }> {
    const prompt = `제목 "${title}"의 SEO를 분석해주세요.
    타겟 키워드: ${targetKeywords.join(", ")}

    다음 사항들을 고려하여 분석해주세요:
    1. 길이 (50-60자 권장)
    2. 키워드 포함 여부
    3. 클릭을 유도하는 표현
    4. 명확성과 가독성

    JSON 형식으로 응답해주세요:
    {
      "score": 85,
      "suggestions": ["제목이 너무 길어요", "주요 키워드를 포함하세요"],
      "optimalLength": 55
    }`;

    try {
      const response = await this.aiService.createChatCompletion([
        {
          role: "system",
          content:
            "SEO 제목 분석 전문가입니다. 구체적이고 실용적인 제안을 해주세요.",
        },
        {
          role: "user",
          content: prompt,
        },
      ]);

      const result = JSON.parse(response.content);
      return {
        score: result.score || 0,
        suggestions: result.suggestions || [],
        optimalLength: result.optimalLength || 60,
      };
    } catch {
      console.error("제목 분석 중 오류:");
      return { score: 0, suggestions: [], optimalLength: 60 };
    }
  }

  /**
   * 콘텐츠 SEO 분석
   */
  async analyzeContent(
    content: string,
    targetKeywords: string[] = []
  ): Promise<{
    score: number;
    keywordDensity: Record<string, number>;
    readabilityIssues: string[];
    structureSuggestions: string[];
  }> {
    const prompt = `다음 콘텐츠의 SEO를 분석해주세요:

    콘텐츠: ${content.substring(0, 2000)}...
    타겟 키워드: ${targetKeywords.join(", ")}

    다음 사항들을 분석해주세요:
    1. 키워드 밀도와 배치
    2. 제목 구조 (H1, H2, H3)
    3. 문단 길이와 가독성
    4. 내부 링크 구조
    5. 이미지 최적화

    JSON 형식으로 응답해주세요:
    {
      "score": 80,
      "keywordDensity": {"키워드1": 2.1, "키워드2": 1.8},
      "readabilityIssues": ["문단이 너무 깁니다", "제목 구조가 불명확합니다"],
      "structureSuggestions": ["H2 제목을 더 추가하세요", "문단을 3-4문장으로 나누세요"]
    }`;

    try {
      const response = await this.aiService.createChatCompletion([
        {
          role: "system",
          content:
            "콘텐츠 SEO 분석 전문가입니다. 구체적이고 실행 가능한 제안을 해주세요.",
        },
        {
          role: "user",
          content: prompt,
        },
      ]);

      const result = JSON.parse(response.content);
      return {
        score: result.score || 0,
        keywordDensity: result.keywordDensity || {},
        readabilityIssues: result.readabilityIssues || [],
        structureSuggestions: result.structureSuggestions || [],
      };
    } catch (error) {
      console.error("콘텐츠 분석 중 오류:", error);
      return {
        score: 0,
        keywordDensity: {},
        readabilityIssues: [],
        structureSuggestions: [],
      };
    }
  }

  /**
   * 키워드 최적화 제안
   */
  async suggestKeywords(
    title: string,
    content: string,
    industry: string = "일반"
  ): Promise<{
    primaryKeywords: string[];
    longTailKeywords: string[];
    relatedKeywords: string[];
    searchVolume: Record<string, "high" | "medium" | "low">;
  }> {
    const prompt = `제목: "${title}"
    콘텐츠: ${content.substring(0, 1000)}...
    산업: ${industry}

    위 콘텐츠에 최적화된 키워드를 제안해주세요:
    1. 주요 키워드 (1-2개)
    2. 롱테일 키워드 (3-5개)
    3. 관련 키워드 (5-8개)

    JSON 형식으로 응답해주세요:
    {
      "primaryKeywords": ["주요키워드1", "주요키워드2"],
      "longTailKeywords": ["롱테일키워드1", "롱테일키워드2"],
      "relatedKeywords": ["관련키워드1", "관련키워드2"],
      "searchVolume": {"키워드1": "high", "키워드2": "medium"}
    }`;

    try {
      const response = await this.aiService.createChatCompletion([
        {
          role: "system",
          content:
            "키워드 최적화 전문가입니다. 검색 트렌드와 경쟁력을 고려한 키워드를 제안해주세요.",
        },
        {
          role: "user",
          content: prompt,
        },
      ]);

      const result = JSON.parse(response.content);
      return {
        primaryKeywords: result.primaryKeywords || [],
        longTailKeywords: result.longTailKeywords || [],
        relatedKeywords: result.relatedKeywords || [],
        searchVolume: result.searchVolume || {},
      };
    } catch (error) {
      console.error("키워드 제안 중 오류:", error);
      return {
        primaryKeywords: [],
        longTailKeywords: [],
        relatedKeywords: [],
        searchVolume: {},
      };
    }
  }

  /**
   * 분석 프롬프트 생성
   */
  private createAnalysisPrompt(
    title: string,
    content: string,
    targetKeywords: string[]
  ): string {
    return `다음 블로그 포스트의 SEO를 종합적으로 분석해주세요:

제목: "${title}"
콘텐츠: ${content.substring(0, 3000)}...
타겟 키워드: ${
      targetKeywords.length > 0 ? targetKeywords.join(", ") : "지정되지 않음"
    }

다음 항목들을 종합적으로 평가해주세요:

1. 제목 최적화 (길이, 키워드 포함, 클릭률)
2. 콘텐츠 품질 (가독성, 구조, 키워드 밀도)
3. 기술적 SEO (제목 구조, 내부 링크, 이미지)
4. 키워드 전략 (주요 키워드, 롱테일 키워드, 키워드 갭)
5. 사용자 경험 (가독성, 구조, 정보 전달)

각 항목에 대해 구체적인 점수와 개선 제안을 제공해주세요.`;
  }

  /**
   * 결과 검증 및 포맷팅
   */
  private validateAndFormatResult(result: unknown): SEOAnalysisResult {
    // 타입 가드를 사용하여 안전하게 접근
    const safeResult = result as Record<string, unknown>;

    return {
      score: Math.min(100, Math.max(0, (safeResult.score as number) || 0)),
      grade: this.calculateGrade((safeResult.score as number) || 0),
      summary: (safeResult.summary as string) || "SEO 분석이 완료되었습니다.",
      improvements: Array.isArray(safeResult.improvements)
        ? (safeResult.improvements as SEOImprovement[])
        : [],
      keywordAnalysis: (safeResult.keywordAnalysis as KeywordAnalysis) || {
        primaryKeywords: [],
        secondaryKeywords: [],
        keywordDensity: {},
        keywordGaps: [],
        keywordOpportunities: [],
      },
      readabilityScore: Math.min(
        100,
        Math.max(0, (safeResult.readabilityScore as number) || 0)
      ),
      technicalScore: Math.min(
        100,
        Math.max(0, (safeResult.technicalScore as number) || 0)
      ),
      contentScore: Math.min(
        100,
        Math.max(0, (safeResult.contentScore as number) || 0)
      ),
    };
  }

  /**
   * 점수에 따른 등급 계산
   */
  private calculateGrade(score: number): "A" | "B" | "C" | "D" | "F" {
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "F";
  }

  /**
   * 기본 결과 생성
   */
  private createDefaultResult(): SEOAnalysisResult {
    return {
      score: 0,
      grade: "F",
      summary: "SEO 분석을 수행할 수 없습니다. 다시 시도해주세요.",
      improvements: [],
      keywordAnalysis: {
        primaryKeywords: [],
        secondaryKeywords: [],
        keywordDensity: {},
        keywordGaps: [],
        keywordOpportunities: [],
      },
      readabilityScore: 0,
      technicalScore: 0,
      contentScore: 0,
    };
  }
}
