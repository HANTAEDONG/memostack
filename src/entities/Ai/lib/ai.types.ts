// AI 모델 타입 정의
export type AIModel =
  | "gpt-4o"
  | "gpt-4o-mini"
  | "gpt-4-turbo"
  | "gpt-3.5-turbo"
  | "gpt-3.5-turbo-16k";

// AI 역할 타입 정의
export type AIRole = "system" | "user" | "assistant";

// AI 메시지 타입 정의
export interface AIMessage {
  role: AIRole;
  content: string;
  name?: string;
}

// AI 요청 옵션 타입 정의
export interface AIRequestOptions {
  model?: AIModel;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stop?: string | string[];
}

// AI 응답 타입 정의
export interface AIResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  model: string;
  finish_reason?: string;
}

// AI 에러 타입 정의
export interface AIError {
  code: string;
  message: string;
  details?: unknown;
}

// AI 기능 타입 정의
export type AIFunction =
  | "text_generation"
  | "code_generation"
  | "text_summarization"
  | "text_translation"
  | "sentiment_analysis"
  | "content_improvement";

// AI 프롬프트 템플릿 타입 정의
export interface AIPromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  variables: string[];
  function: AIFunction;
}

// AI 대화 세션 타입 정의
export interface AIConversation {
  id: string;
  title: string;
  messages: AIMessage[];
  createdAt: Date;
  updatedAt: Date;
  model: AIModel;
  totalTokens: number;
}

// AI 설정 타입 정의
export interface AIConfig {
  defaultModel: AIModel;
  maxTokens: number;
  temperature: number;
  enableStreaming: boolean;
  enableFunctionCalling: boolean;
}
