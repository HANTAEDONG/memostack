import { AIConfig, AIModel } from "../lib/ai.types";

export class AIConfigManager {
  private config: AIConfig;
  private readonly STORAGE_KEY = "ai_config";

  constructor() {
    this.config = this.loadConfig();
  }

  /**
   * 기본 설정 로드
   */
  private loadConfig(): AIConfig {
    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
          return JSON.parse(stored);
        }
      }
    } catch (error) {
      console.warn(
        "저장된 AI 설정을 불러올 수 없습니다. 기본 설정을 사용합니다.",
        error
      );
    }

    return this.getDefaultConfig();
  }

  /**
   * 기본 설정 반환
   */
  private getDefaultConfig(): AIConfig {
    return {
      defaultModel: "gpt-4o-mini",
      maxTokens: 1000,
      temperature: 0.7,
      enableStreaming: true,
      enableFunctionCalling: false,
    };
  }

  /**
   * 설정 저장
   */
  private saveConfig(): void {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.config));
      }
    } catch (error) {
      console.warn("AI 설정을 저장할 수 없습니다.", error);
    }
  }

  /**
   * 전체 설정 조회
   */
  getConfig(): AIConfig {
    return { ...this.config };
  }

  /**
   * 기본 모델 설정
   */
  setDefaultModel(model: AIModel): void {
    this.config.defaultModel = model;
    this.saveConfig();
  }

  /**
   * 기본 모델 조회
   */
  getDefaultModel(): AIModel {
    return this.config.defaultModel;
  }

  /**
   * 최대 토큰 수 설정
   */
  setMaxTokens(maxTokens: number): void {
    this.config.maxTokens = Math.max(1, Math.min(maxTokens, 128000));
    this.saveConfig();
  }

  /**
   * 최대 토큰 수 조회
   */
  getMaxTokens(): number {
    return this.config.maxTokens;
  }

  /**
   * 온도 설정
   */
  setTemperature(temperature: number): void {
    this.config.temperature = Math.max(0, Math.min(temperature, 2));
    this.saveConfig();
  }

  /**
   * 온도 조회
   */
  getTemperature(): number {
    return this.config.temperature;
  }

  /**
   * 스트리밍 활성화/비활성화
   */
  setStreamingEnabled(enabled: boolean): void {
    this.config.enableStreaming = enabled;
    this.saveConfig();
  }

  /**
   * 스트리밍 활성화 상태 조회
   */
  isStreamingEnabled(): boolean {
    return this.config.enableStreaming;
  }

  /**
   * 함수 호출 활성화/비활성화
   */
  setFunctionCallingEnabled(enabled: boolean): void {
    this.config.enableFunctionCalling = enabled;
    this.saveConfig();
  }

  /**
   * 함수 호출 활성화 상태 조회
   */
  isFunctionCallingEnabled(): boolean {
    return this.config.enableFunctionCalling;
  }

  /**
   * 설정 초기화
   */
  resetConfig(): void {
    this.config = this.getDefaultConfig();
    this.saveConfig();
  }

  /**
   * 설정 업데이트
   */
  updateConfig(updates: Partial<AIConfig>): void {
    this.config = { ...this.config, ...updates };

    // 값 범위 검증
    if (this.config.maxTokens !== undefined) {
      this.config.maxTokens = Math.max(
        1,
        Math.min(this.config.maxTokens, 128000)
      );
    }

    if (this.config.temperature !== undefined) {
      this.config.temperature = Math.max(
        0,
        Math.min(this.config.temperature, 2)
      );
    }

    this.saveConfig();
  }

  /**
   * 모델별 권장 설정 조회
   */
  getRecommendedConfig(model: AIModel): Partial<AIConfig> {
    const recommendations: Record<AIModel, Partial<AIConfig>> = {
      "gpt-4o": {
        maxTokens: 4000,
        temperature: 0.7,
        enableStreaming: true,
        enableFunctionCalling: true,
      },
      "gpt-4o-mini": {
        maxTokens: 2000,
        temperature: 0.7,
        enableStreaming: true,
        enableFunctionCalling: false,
      },
      "gpt-4-turbo": {
        maxTokens: 4000,
        temperature: 0.7,
        enableStreaming: true,
        enableFunctionCalling: true,
      },
      "gpt-3.5-turbo": {
        maxTokens: 2000,
        temperature: 0.7,
        enableStreaming: true,
        enableFunctionCalling: false,
      },
      "gpt-3.5-turbo-16k": {
        maxTokens: 8000,
        temperature: 0.7,
        enableStreaming: true,
        enableFunctionCalling: false,
      },
    };

    return recommendations[model] || {};
  }

  /**
   * 설정 유효성 검사
   */
  validateConfig(config: AIConfig): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (config.maxTokens < 1 || config.maxTokens > 128000) {
      errors.push("최대 토큰 수는 1에서 128000 사이여야 합니다.");
    }

    if (config.temperature < 0 || config.temperature > 2) {
      errors.push("온도는 0에서 2 사이여야 합니다.");
    }

    if (!config.defaultModel) {
      errors.push("기본 모델이 설정되지 않았습니다.");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * 설정 내보내기 (JSON)
   */
  exportConfig(): string {
    return JSON.stringify(this.config, null, 2);
  }

  /**
   * 설정 가져오기 (JSON)
   */
  importConfig(jsonData: string): { success: boolean; errors?: string[] } {
    try {
      const importedConfig = JSON.parse(jsonData) as AIConfig;
      const validation = this.validateConfig(importedConfig);

      if (validation.isValid) {
        this.config = importedConfig;
        this.saveConfig();
        return { success: true };
      } else {
        return {
          success: false,
          errors: validation.errors,
        };
      }
    } catch {
      return {
        success: false,
        errors: ["JSON 파싱 오류가 발생했습니다."],
      };
    }
  }

  /**
   * 설정 통계 조회
   */
  getConfigStats(): {
    totalSettings: number;
    modifiedSettings: number;
    lastModified: Date | null;
  } {
    const defaultConfig = this.getDefaultConfig();
    const modifiedSettings = Object.keys(this.config).filter(
      (key) =>
        this.config[key as keyof AIConfig] !==
        defaultConfig[key as keyof AIConfig]
    ).length;

    return {
      totalSettings: Object.keys(this.config).length,
      modifiedSettings,
      lastModified: this.getLastModifiedTime(),
    };
  }

  /**
   * 마지막 수정 시간 조회
   */
  private getLastModifiedTime(): Date | null {
    try {
      if (typeof window !== "undefined") {
        const lastModified = localStorage.getItem(
          `${this.STORAGE_KEY}_last_modified`
        );
        return lastModified ? new Date(lastModified) : null;
      }
    } catch (error) {
      console.warn("마지막 수정 시간을 불러올 수 없습니다.", error);
    }
    return null;
  }

  /**
   * 마지막 수정 시간 업데이트
   */
  private updateLastModifiedTime(): void {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(
          `${this.STORAGE_KEY}_last_modified`,
          new Date().toISOString()
        );
      }
    } catch (error) {
      console.warn("마지막 수정 시간을 업데이트할 수 없습니다.", error);
    }
  }
}
