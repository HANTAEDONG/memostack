import { AIPromptTemplate, AIFunction } from "../lib/ai.types";

export class PromptTemplateManager {
  private templates: Map<string, AIPromptTemplate> = new Map();

  constructor() {
    this.initializeDefaultTemplates();
  }

  /**
   * 기본 프롬프트 템플릿 초기화
   */
  private initializeDefaultTemplates(): void {
    const defaultTemplates: AIPromptTemplate[] = [
      {
        id: "blog-post-writer",
        name: "블로그 포스트 작성자",
        description: "블로그 포스트를 작성하는 AI 어시스턴트",
        template:
          "주제: {{topic}}\n\n키워드: {{keywords}}\n\n목표 독자: {{targetAudience}}\n\n위 정보를 바탕으로 블로그 포스트를 작성해주세요. SEO를 고려하여 최적화된 내용으로 작성해주세요.",
        variables: ["topic", "keywords", "targetAudience"],
        function: "text_generation",
      },
      {
        id: "code-reviewer",
        name: "코드 리뷰어",
        description: "코드를 검토하고 개선점을 제안하는 AI 어시스턴트",
        template:
          "프로그래밍 언어: {{language}}\n\n코드:\n{{code}}\n\n위 코드를 검토하고 개선점, 보안 이슈, 성능 최적화 방안을 제안해주세요.",
        variables: ["language", "code"],
        function: "code_generation",
      },
      {
        id: "text-summarizer",
        name: "텍스트 요약기",
        description: "긴 텍스트를 간결하게 요약하는 AI 어시스턴트",
        template:
          "다음 텍스트를 {{maxLength}}자 이내로 요약해주세요:\n\n{{text}}\n\n핵심 내용만 간결하게 요약해주세요.",
        variables: ["text", "maxLength"],
        function: "text_summarization",
      },
      {
        id: "content-improver",
        name: "콘텐츠 개선자",
        description: "텍스트 콘텐츠를 개선하고 품질을 향상시키는 AI 어시스턴트",
        template:
          "원본 텍스트:\n{{originalText}}\n\n개선 목표: {{improvementGoal}}\n\n위 텍스트를 {{improvementGoal}}에 맞게 개선해주세요. 문법, 스타일, 가독성을 향상시켜주세요.",
        variables: ["originalText", "improvementGoal"],
        function: "content_improvement",
      },
      {
        id: "sentiment-analyzer",
        name: "감정 분석기",
        description: "텍스트의 감정을 분석하는 AI 어시스턴트",
        template:
          "분석할 텍스트:\n{{text}}\n\n위 텍스트의 감정을 분석해주세요. 긍정, 부정, 중립 중 하나로 분류하고, 그 이유와 감정 강도를 설명해주세요.",
        variables: ["text"],
        function: "sentiment_analysis",
      },
      {
        id: "translator",
        name: "번역가",
        description: "텍스트를 다른 언어로 번역하는 AI 어시스턴트",
        template:
          "원본 언어: {{sourceLanguage}}\n\n대상 언어: {{targetLanguage}}\n\n번역할 텍스트:\n{{text}}\n\n위 텍스트를 {{targetLanguage}}로 자연스럽게 번역해주세요.",
        variables: ["sourceLanguage", "targetLanguage", "text"],
        function: "text_translation",
      },
    ];

    defaultTemplates.forEach((template) => {
      this.templates.set(template.id, template);
    });
  }

  /**
   * 템플릿 추가
   */
  addTemplate(template: AIPromptTemplate): void {
    this.templates.set(template.id, template);
  }

  /**
   * 템플릿 수정
   */
  updateTemplate(id: string, updates: Partial<AIPromptTemplate>): boolean {
    const template = this.templates.get(id);
    if (!template) return false;

    const updatedTemplate = { ...template, ...updates };
    this.templates.set(id, updatedTemplate);
    return true;
  }

  /**
   * 템플릿 삭제
   */
  removeTemplate(id: string): boolean {
    return this.templates.delete(id);
  }

  /**
   * 템플릿 조회
   */
  getTemplate(id: string): AIPromptTemplate | undefined {
    return this.templates.get(id);
  }

  /**
   * 모든 템플릿 조회
   */
  getAllTemplates(): AIPromptTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * 기능별 템플릿 조회
   */
  getTemplatesByFunction(functionType: AIFunction): AIPromptTemplate[] {
    return Array.from(this.templates.values()).filter(
      (template) => template.function === functionType
    );
  }

  /**
   * 템플릿 검색
   */
  searchTemplates(query: string): AIPromptTemplate[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.templates.values()).filter(
      (template) =>
        template.name.toLowerCase().includes(lowerQuery) ||
        template.description.toLowerCase().includes(lowerQuery) ||
        template.function.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * 템플릿 변수 추출
   */
  extractVariables(templateId: string): string[] {
    const template = this.templates.get(templateId);
    return template?.variables || [];
  }

  /**
   * 템플릿 유효성 검사
   */
  validateTemplate(template: AIPromptTemplate): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!template.id || template.id.trim() === "") {
      errors.push("템플릿 ID는 필수입니다.");
    }

    if (!template.name || template.name.trim() === "") {
      errors.push("템플릿 이름은 필수입니다.");
    }

    if (!template.template || template.template.trim() === "") {
      errors.push("템플릿 내용은 필수입니다.");
    }

    if (!template.variables || template.variables.length === 0) {
      errors.push("템플릿 변수는 최소 하나 이상 필요합니다.");
    }

    if (!template.function) {
      errors.push("템플릿 기능은 필수입니다.");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * 템플릿 내보내기 (JSON)
   */
  exportTemplates(): string {
    return JSON.stringify(Array.from(this.templates.values()), null, 2);
  }

  /**
   * 템플릿 가져오기 (JSON)
   */
  importTemplates(jsonData: string): { success: boolean; errors: string[] } {
    try {
      const templates = JSON.parse(jsonData) as AIPromptTemplate[];
      const errors: string[] = [];

      templates.forEach((template) => {
        const validation = this.validateTemplate(template);
        if (validation.isValid) {
          this.templates.set(template.id, template);
        } else {
          errors.push(
            `템플릿 "${template.name}": ${validation.errors.join(", ")}`
          );
        }
      });

      return {
        success: errors.length === 0,
        errors,
      };
    } catch {
      return {
        success: false,
        errors: ["JSON 파싱 오류가 발생했습니다."],
      };
    }
  }
}
