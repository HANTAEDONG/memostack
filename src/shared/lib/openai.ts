import OpenAI from "openai";

// OpenAI 클라이언트 인스턴스 생성
export const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      organization: process.env.OPENAI_ORGANIZATION, // 선택사항
    })
  : null;

// 기본 모델 설정
export const DEFAULT_MODEL = "gpt-4o-mini" as const;
export const DEFAULT_MODEL_TURBO = "gpt-3.5-turbo" as const;

// API 응답 타입 정의
export interface OpenAIResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// 기본 채팅 완성 함수
export async function createChatCompletion(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  model: string = DEFAULT_MODEL,
  options?: Partial<OpenAI.Chat.Completions.ChatCompletionCreateParams>
): Promise<OpenAIResponse> {
  try {
    if (!openai) {
      throw new Error("OpenAI API 키가 설정되지 않았습니다.");
    }

    const completion = await openai.chat.completions.create({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 1000,
      ...options,
    });

    // 스트림이 아닌 일반 응답인지 확인
    if ("choices" in completion) {
      const content = completion.choices[0]?.message?.content || "";
      const usage = completion.usage;

      return {
        content,
        usage,
      };
    } else {
      throw new Error("스트림 응답은 지원하지 않습니다.");
    }
  } catch (error) {
    console.error("OpenAI API 호출 중 오류 발생:", error);
    throw new Error("AI 응답 생성에 실패했습니다.");
  }
}

// 텍스트 완성 함수 (GPT-3.5 모델용)
export async function createCompletion(
  prompt: string,
  model: string = DEFAULT_MODEL_TURBO,
  options?: Partial<OpenAI.Completions.CompletionCreateParams>
): Promise<OpenAIResponse> {
  try {
    if (!openai) {
      throw new Error("OpenAI API 키가 설정되지 않았습니다.");
    }

    const completion = await openai.completions.create({
      model,
      prompt,
      max_tokens: 1000,
      temperature: 0.7,
      ...options,
    });

    // 스트림이 아닌 일반 응답인지 확인
    if ("choices" in completion) {
      const content = completion.choices[0]?.text || "";
      const usage = completion.usage;

      return {
        content,
        usage,
      };
    } else {
      throw new Error("스트림 응답은 지원하지 않습니다.");
    }
  } catch (error) {
    console.error("OpenAI API 호출 중 오류 발생:", error);
    throw new Error("AI 응답 생성에 실패했습니다.");
  }
}

// 에러 처리 헬퍼 함수
export function handleOpenAIError(error: unknown): string {
  // OpenAI API 에러 타입 체크
  if (error && typeof error === "object" && "response" in error) {
    const response = (error as { response?: { status?: number } }).response;
    if (response?.status === 401) {
      return "API 키가 유효하지 않습니다. 환경 변수를 확인해주세요.";
    } else if (response?.status === 429) {
      return "API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.";
    } else if (response?.status === 500) {
      return "OpenAI 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
    }
  }
  return "알 수 없는 오류가 발생했습니다.";
}
