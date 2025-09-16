import OpenAI from "openai";
import {
  AIModel,
  AIMessage,
  AIRequestOptions,
  AIResponse,
  AIError,
  AIPromptTemplate,
} from "../lib/ai.types";

export class AIService {
  private openai: OpenAI;
  private defaultModel: AIModel = "gpt-4o-mini";
  private defaultMaxTokens = 1000;
  private defaultTemperature = 0.7;

  constructor(apiKey?: string) {
    // 환경 변수에서 API 키 가져오기
    const envApiKey =
      typeof window === "undefined"
        ? process.env.OPENAI_API_KEY
        : process.env.NEXT_PUBLIC_OPENAI_API_KEY;

    const finalApiKey = apiKey || envApiKey;

    if (!finalApiKey) {
      throw new Error(
        "OpenAI API 키가 설정되지 않았습니다. 환경 변수 OPENAI_API_KEY 또는 NEXT_PUBLIC_OPENAI_API_KEY를 확인해주세요."
      );
    }

    // ⚠️ 보안 주의사항:
    // dangerouslyAllowBrowser: true는 브라우저에서 API 키를 노출할 수 있습니다.
    // 프로덕션 환경에서는 서버 사이드에서만 API를 호출하는 것을 권장합니다.
    this.openai = new OpenAI({
      apiKey: finalApiKey,
      dangerouslyAllowBrowser: true, // 브라우저 환경에서 사용 허용
    });
  }

  /**
   * 채팅 완성 생성 (자동 모델 전환 포함)
   */
  async createChatCompletion(
    messages: AIMessage[],
    options?: AIRequestOptions
  ): Promise<AIResponse> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: options?.model || this.defaultModel,
        messages:
          messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
        temperature: options?.temperature || this.defaultTemperature,
        max_tokens: options?.maxTokens || this.defaultMaxTokens,
        top_p: options?.topP,
        frequency_penalty: options?.frequencyPenalty,
        presence_penalty: options?.presencePenalty,
        stop: options?.stop,
      });

      return {
        content: completion.choices[0]?.message?.content || "",
        usage: completion.usage,
        model: completion.model,
        finish_reason: completion.choices[0]?.finish_reason,
      };
    } catch (error) {
      // 할당량 초과 오류인 경우 무료 모델로 재시도
      if (this.isQuotaExceededError(error)) {
        console.log("할당량 초과, 무료 모델로 재시도 중...");
        return this.retryWithFreeModel(messages, options);
      }
      throw this.handleError(error);
    }
  }

  /**
   * 할당량 초과 오류인지 확인
   */
  private isQuotaExceededError(error: unknown): boolean {
    console.log("에러 객체:", error);

    if (error && typeof error === "object") {
      // OpenAI v4+ 에러 형식 확인
      if ("status" in error && (error as { status?: number }).status === 429) {
        return true;
      }

      // 기존 response 형식 확인
      if ("response" in error) {
        const response = (error as { response?: { status?: number } }).response;
        if (response?.status === 429) {
          return true;
        }
      }

      // code 속성 확인
      if (
        "code" in error &&
        (error as { code?: string }).code === "insufficient_quota"
      ) {
        return true;
      }
    }

    return false;
  }

  /**
   * 무료 모델로 재시도
   */
  private async retryWithFreeModel(
    messages: AIMessage[],
    options?: AIRequestOptions
  ): Promise<AIResponse> {
    try {
      console.log("gpt-3.5-turbo 모델로 재시도 중...");
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo", // 무료 모델
        messages:
          messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
        temperature: options?.temperature || this.defaultTemperature,
        max_tokens: options?.maxTokens || this.defaultMaxTokens,
        top_p: options?.topP,
        frequency_penalty: options?.frequencyPenalty,
        presence_penalty: options?.presencePenalty,
        stop: options?.stop,
      });

      return {
        content: completion.choices[0]?.message?.content || "",
        usage: completion.usage,
        model: completion.model,
        finish_reason: completion.choices[0]?.finish_reason,
      };
    } catch (retryError) {
      console.error("무료 모델로도 실패:", retryError);
      throw this.handleError(retryError);
    }
  }

  /**
   * 텍스트 완성 생성 (GPT-3.5 모델용)
   */
  async createCompletion(
    prompt: string,
    options?: AIRequestOptions
  ): Promise<AIResponse> {
    try {
      const completion = await this.openai.completions.create({
        model: options?.model || "gpt-3.5-turbo",
        prompt,
        max_tokens: options?.maxTokens || this.defaultMaxTokens,
        temperature: options?.temperature || this.defaultTemperature,
        top_p: options?.topP,
        frequency_penalty: options?.frequencyPenalty,
        presence_penalty: options?.presencePenalty,
        stop: options?.stop,
      });

      return {
        content: completion.choices[0]?.text || "",
        usage: completion.usage,
        model: completion.model,
        finish_reason: completion.choices[0]?.finish_reason,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * 스트리밍 채팅 완성 생성
   */
  async createStreamingChatCompletion(
    messages: AIMessage[],
    options?: AIRequestOptions,
    onChunk?: (chunk: string) => void
  ): Promise<AIResponse> {
    try {
      const stream = await this.openai.chat.completions.create({
        model: options?.model || this.defaultModel,
        messages:
          messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
        temperature: options?.temperature || this.defaultTemperature,
        max_tokens: options?.maxTokens || this.defaultMaxTokens,
        stream: true,
      });

      let fullContent = "";
      let usage = { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        fullContent += content;

        if (onChunk) {
          onChunk(content);
        }

        if (chunk.usage) {
          usage = chunk.usage;
        }
      }

      return {
        content: fullContent,
        usage,
        model: options?.model || this.defaultModel,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * 텍스트 요약 생성
   */
  async summarizeText(
    text: string,
    maxLength: number = 200,
    options?: AIRequestOptions
  ): Promise<AIResponse> {
    const prompt = `다음 텍스트를 ${maxLength}자 이내로 요약해주세요:\n\n${text}`;

    const messages: AIMessage[] = [
      {
        role: "system",
        content: "텍스트 요약 전문가입니다. 핵심 내용을 간결하게 요약해주세요.",
      },
      {
        role: "user",
        content: prompt,
      },
    ];

    return this.createChatCompletion(messages, options);
  }

  /**
   * 코드 생성
   */
  async generateCode(
    description: string,
    language: string,
    options?: AIRequestOptions
  ): Promise<AIResponse> {
    const prompt = `${language} 언어로 다음 요구사항에 맞는 코드를 생성해주세요:\n\n${description}`;

    const messages: AIMessage[] = [
      {
        role: "system",
        content: `당신은 ${language} 전문 개발자입니다. 깔끔하고 효율적인 코드를 작성해주세요.`,
      },
      {
        role: "user",
        content: prompt,
      },
    ];

    return this.createChatCompletion(messages, options);
  }

  /**
   * 텍스트 번역
   */
  async translateText(
    text: string,
    targetLanguage: string,
    sourceLanguage?: string,
    options?: AIRequestOptions
  ): Promise<AIResponse> {
    const sourceLang = sourceLanguage ? `(${sourceLanguage})` : "";
    const prompt = `다음 텍스트를 ${targetLanguage}로 번역해주세요${sourceLang}:\n\n${text}`;

    const messages: AIMessage[] = [
      {
        role: "system",
        content: "전문 번역가입니다. 자연스럽고 정확한 번역을 제공해주세요.",
      },
      {
        role: "user",
        content: prompt,
      },
    ];

    return this.createChatCompletion(messages, options);
  }

  /**
   * 감정 분석
   */
  async analyzeSentiment(
    text: string,
    options?: AIRequestOptions
  ): Promise<AIResponse> {
    const prompt = `다음 텍스트의 감정을 분석해주세요. 긍정, 부정, 중립 중 하나로 분류하고 이유를 설명해주세요:\n\n${text}`;

    const messages: AIMessage[] = [
      {
        role: "system",
        content:
          "감정 분석 전문가입니다. 텍스트의 감정을 정확하게 분석해주세요.",
      },
      {
        role: "user",
        content: prompt,
      },
    ];

    return this.createChatCompletion(messages, options);
  }

  /**
   * 프롬프트 템플릿 처리
   */
  async processPromptTemplate(
    template: AIPromptTemplate,
    variables: Record<string, string>,
    options?: AIRequestOptions
  ): Promise<AIResponse> {
    let processedTemplate = template.template;

    // 변수 치환
    for (const [key, value] of Object.entries(variables)) {
      processedTemplate = processedTemplate.replace(`{{${key}}}`, value);
    }

    const messages: AIMessage[] = [
      {
        role: "system",
        content: `당신은 ${template.function} 전문가입니다.`,
      },
      {
        role: "user",
        content: processedTemplate,
      },
    ];

    return this.createChatCompletion(messages, options);
  }

  /**
   * 에러 처리
   */
  private handleError(error: unknown): AIError {
    if (error && typeof error === "object" && "response" in error) {
      const response = (error as { response?: { status?: number } }).response;

      if (response?.status === 401) {
        return {
          code: "UNAUTHORIZED",
          message: "API 키가 유효하지 않습니다. 환경 변수를 확인해주세요.",
          details: error,
        };
      } else if (response?.status === 429) {
        return {
          code: "RATE_LIMIT_EXCEEDED",
          message: "API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.",
          details: error,
        };
      } else if (response?.status === 500) {
        return {
          code: "SERVER_ERROR",
          message:
            "OpenAI 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
          details: error,
        };
      }
    }

    return {
      code: "UNKNOWN_ERROR",
      message: "알 수 없는 오류가 발생했습니다.",
      details: error,
    };
  }

  /**
   * 토큰 사용량 계산 (대략적)
   */
  estimateTokenCount(text: string): number {
    // 영어 기준으로 대략적인 토큰 수 계산 (1 토큰 ≈ 4 문자)
    return Math.ceil(text.length / 4);
  }

  /**
   * 모델별 최대 토큰 제한 확인
   */
  getModelMaxTokens(model: AIModel): number {
    const modelLimits: Record<AIModel, number> = {
      "gpt-4o": 128000,
      "gpt-4o-mini": 128000,
      "gpt-4-turbo": 128000,
      "gpt-3.5-turbo": 16385,
      "gpt-3.5-turbo-16k": 16385,
    };

    return modelLimits[model] || 4096;
  }
}
