// AI 엔티티 메인 인덱스 파일

// 타입 내보내기
export * from "./lib/ai.types";

// 서비스 클래스 내보내기
export { AIService } from "./model/ai.service";
export { PromptTemplateManager } from "./model/prompt-template.manager";
export { AIConfigManager } from "./lib/ai-config.manager";
export { SEOAnalyzerService } from "./model/seo-analyzer.service";

// AI 엔티티 통합 관리자
export class AIManager {
  private aiService: unknown = null;
  private promptTemplateManager: unknown = null;
  private conversationManager: unknown = null;
  private configManager: unknown = null;

  constructor() {
    // 생성자에서는 초기화하지 않음
  }

  /**
   * AI 기능 초기화
   */
  async initialize(): Promise<void> {
    try {
      // 동적 임포트를 사용하여 순환 참조 방지
      const { AIService } = await import("./model/ai.service");
      const { PromptTemplateManager } = await import(
        "./model/prompt-template.manager"
      );

      const { AIConfigManager } = await import("./lib/ai-config.manager");

      // 각 매니저 초기화
      this.aiService = new AIService();
      this.promptTemplateManager = new PromptTemplateManager();
      this.configManager = new AIConfigManager();

      console.log("AI 엔티티가 성공적으로 초기화되었습니다.");
    } catch (error) {
      console.error("AI 엔티티 초기화 중 오류 발생:", error);
      throw error;
    }
  }

  // AI 서비스 접근자
  get ai(): unknown {
    if (!this.aiService) {
      throw new Error(
        "AI 서비스가 초기화되지 않았습니다. initialize() 메서드를 먼저 호출하세요."
      );
    }
    return this.aiService;
  }

  // 프롬프트 템플릿 매니저 접근자
  get templates(): unknown {
    if (!this.promptTemplateManager) {
      throw new Error(
        "프롬프트 템플릿 매니저가 초기화되지 않았습니다. initialize() 메서드를 먼저 호출하세요."
      );
    }
    return this.promptTemplateManager;
  }

  // 대화 세션 매니저 접근자
  get conversations(): unknown {
    if (!this.conversationManager) {
      throw new Error(
        "대화 세션 매니저가 초기화되지 않았습니다. initialize() 메서드를 먼저 호출하세요."
      );
    }
    return this.conversationManager;
  }

  // 설정 매니저 접근자
  get config(): unknown {
    if (!this.configManager) {
      throw new Error(
        "설정 매니저가 초기화되지 않았습니다. initialize() 메서드를 먼저 호출하세요."
      );
    }
    return this.configManager;
  }

  /**
   * AI 기능 상태 확인
   */
  getStatus(): {
    isInitialized: boolean;
    config: Record<string, unknown>;
    templateCount: number;
    conversationCount: number;
  } {
    return {
      isInitialized: !!this.configManager,
      config: {},
      templateCount: 0,
      conversationCount: 0,
    };
  }

  /**
   * AI 기능 정리
   */
  cleanup(): void {
    // 필요한 정리 작업 수행
    console.log("AI 엔티티 정리 완료");
  }
}

// 기본 인스턴스 생성
export const aiManager = new AIManager();

// 편의를 위한 개별 내보내기 (초기화 후 사용 가능)
export const getAIService = () => aiManager.ai;
export const getPromptTemplates = () => aiManager.templates;
export const getConversations = () => aiManager.conversations;
export const getAIConfig = () => aiManager.config;

// SEO 분석기 관련
export const getSEOAnalyzer = async () => {
  const { SEOAnalyzerService } = await import("./model/seo-analyzer.service");
  return new SEOAnalyzerService();
};
