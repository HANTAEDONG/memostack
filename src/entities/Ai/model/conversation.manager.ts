import { AIConversation, AIMessage, AIModel } from "../lib/ai.types";

export class ConversationManager {
  private conversations: Map<string, AIConversation> = new Map();
  private currentConversationId: string | null = null;

  constructor() {
    this.initializeDefaultConversation();
  }

  /**
   * 기본 대화 세션 초기화
   */
  private initializeDefaultConversation(): void {
    const defaultConversation: AIConversation = {
      id: this.generateId(),
      title: "새로운 대화",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      model: "gpt-4o-mini",
      totalTokens: 0,
    };

    this.conversations.set(defaultConversation.id, defaultConversation);
    this.currentConversationId = defaultConversation.id;
  }

  /**
   * 새 대화 세션 생성
   */
  createConversation(title?: string, model?: AIModel): string {
    const conversationId = this.generateId();
    const conversation: AIConversation = {
      id: conversationId,
      title: title || "새로운 대화",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      model: model || "gpt-4o-mini",
      totalTokens: 0,
    };

    this.conversations.set(conversationId, conversation);
    this.currentConversationId = conversationId;
    return conversationId;
  }

  /**
   * 대화 세션 삭제
   */
  deleteConversation(conversationId: string): boolean {
    const deleted = this.conversations.delete(conversationId);

    if (deleted && this.currentConversationId === conversationId) {
      // 현재 대화가 삭제된 경우, 첫 번째 대화를 현재 대화로 설정
      const firstConversation = Array.from(this.conversations.values())[0];
      this.currentConversationId = firstConversation?.id || null;
    }

    return deleted;
  }

  /**
   * 대화 세션 제목 변경
   */
  updateConversationTitle(conversationId: string, newTitle: string): boolean {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) return false;

    conversation.title = newTitle;
    conversation.updatedAt = new Date();
    return true;
  }

  /**
   * 대화 세션 모델 변경
   */
  updateConversationModel(conversationId: string, newModel: AIModel): boolean {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) return false;

    conversation.model = newModel;
    conversation.updatedAt = new Date();
    return true;
  }

  /**
   * 메시지 추가
   */
  addMessage(conversationId: string, message: AIMessage): boolean {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) return false;

    conversation.messages.push(message);
    conversation.updatedAt = new Date();

    // 토큰 수 업데이트 (대략적 계산)
    const estimatedTokens = this.estimateTokenCount(message.content);
    conversation.totalTokens += estimatedTokens;

    return true;
  }

  /**
   * 메시지 삭제
   */
  removeMessage(conversationId: string, messageIndex: number): boolean {
    const conversation = this.conversations.get(conversationId);
    if (
      !conversation ||
      messageIndex < 0 ||
      messageIndex >= conversation.messages.length
    ) {
      return false;
    }

    const removedMessage = conversation.messages.splice(messageIndex, 1)[0];
    conversation.updatedAt = new Date();

    // 토큰 수 업데이트
    const estimatedTokens = this.estimateTokenCount(removedMessage.content);
    conversation.totalTokens = Math.max(
      0,
      conversation.totalTokens - estimatedTokens
    );

    return true;
  }

  /**
   * 메시지 수정
   */
  updateMessage(
    conversationId: string,
    messageIndex: number,
    newContent: string
  ): boolean {
    const conversation = this.conversations.get(conversationId);
    if (
      !conversation ||
      messageIndex < 0 ||
      messageIndex >= conversation.messages.length
    ) {
      return false;
    }

    const oldMessage = conversation.messages[messageIndex];
    const oldTokens = this.estimateTokenCount(oldMessage.content);
    const newTokens = this.estimateTokenCount(newContent);

    oldMessage.content = newContent;
    conversation.updatedAt = new Date();

    // 토큰 수 업데이트
    conversation.totalTokens = conversation.totalTokens - oldTokens + newTokens;

    return true;
  }

  /**
   * 대화 세션 조회
   */
  getConversation(conversationId: string): AIConversation | undefined {
    return this.conversations.get(conversationId);
  }

  /**
   * 현재 대화 세션 조회
   */
  getCurrentConversation(): AIConversation | undefined {
    if (!this.currentConversationId) return undefined;
    return this.conversations.get(this.currentConversationId);
  }

  /**
   * 모든 대화 세션 조회
   */
  getAllConversations(): AIConversation[] {
    return Array.from(this.conversations.values()).sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
    );
  }

  /**
   * 현재 대화 세션 변경
   */
  setCurrentConversation(conversationId: string): boolean {
    if (!this.conversations.has(conversationId)) return false;

    this.currentConversationId = conversationId;
    return true;
  }

  /**
   * 대화 세션 검색
   */
  searchConversations(query: string): AIConversation[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.conversations.values()).filter(
      (conversation) =>
        conversation.title.toLowerCase().includes(lowerQuery) ||
        conversation.messages.some((message) =>
          message.content.toLowerCase().includes(lowerQuery)
        )
    );
  }

  /**
   * 대화 세션 내보내기 (JSON)
   */
  exportConversation(conversationId: string): string | null {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) return null;

    return JSON.stringify(conversation, null, 2);
  }

  /**
   * 대화 세션 가져오기 (JSON)
   */
  importConversation(jsonData: string): {
    success: boolean;
    conversationId?: string;
    errors?: string[];
  } {
    try {
      const conversation = JSON.parse(jsonData) as AIConversation;

      // 필수 필드 검증
      if (!conversation.id || !conversation.title || !conversation.messages) {
        return {
          success: false,
          errors: ["필수 필드가 누락되었습니다."],
        };
      }

      // ID 중복 방지
      if (this.conversations.has(conversation.id)) {
        conversation.id = this.generateId();
      }

      // 날짜 필드 복원
      conversation.createdAt = new Date(conversation.createdAt);
      conversation.updatedAt = new Date(conversation.updatedAt);

      this.conversations.set(conversation.id, conversation);

      return {
        success: true,
        conversationId: conversation.id,
      };
    } catch (error) {
      return {
        success: false,
        errors: ["JSON 파싱 오류가 발생했습니다."],
      };
    }
  }

  /**
   * 대화 세션 정리 (오래된 메시지 제거)
   */
  cleanupConversation(
    conversationId: string,
    maxMessages: number = 50
  ): boolean {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) return false;

    if (conversation.messages.length > maxMessages) {
      const removedMessages = conversation.messages.splice(
        0,
        conversation.messages.length - maxMessages
      );
      conversation.updatedAt = new Date();

      // 제거된 메시지의 토큰 수 계산
      const removedTokens = removedMessages.reduce((total, message) => {
        return total + this.estimateTokenCount(message.content);
      }, 0);

      conversation.totalTokens = Math.max(
        0,
        conversation.totalTokens - removedTokens
      );
    }

    return true;
  }

  /**
   * 토큰 사용량 통계
   */
  getTokenStatistics(): {
    totalConversations: number;
    totalMessages: number;
    totalTokens: number;
    averageTokensPerMessage: number;
  } {
    const conversations = Array.from(this.conversations.values());
    const totalMessages = conversations.reduce(
      (total, conv) => total + conv.messages.length,
      0
    );
    const totalTokens = conversations.reduce(
      (total, conv) => total + conv.totalTokens,
      0
    );

    return {
      totalConversations: conversations.length,
      totalMessages,
      totalTokens,
      averageTokensPerMessage:
        totalMessages > 0 ? Math.round(totalTokens / totalMessages) : 0,
    };
  }

  /**
   * 고유 ID 생성
   */
  private generateId(): string {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 토큰 수 추정 (대략적 계산)
   */
  private estimateTokenCount(text: string): number {
    // 영어 기준으로 대략적인 토큰 수 계산 (1 토큰 ≈ 4 문자)
    return Math.ceil(text.length / 4);
  }
}
