"use client";

import React, { useState } from "react";
import { Button } from "@/shared/ui/shadcn/button";
import { Input } from "@/shared/ui/shadcn/input";
import { Card } from "@/shared/ui/shadcn/Card";
import { createChatCompletion, handleOpenAIError } from "@/shared/lib/openai";
import { Loader2, Send, Sparkles } from "lucide-react";

interface AIAssistantProps {
  onContentGenerated?: (content: string) => void;
}

export function AIAssistant({ onContentGenerated }: AIAssistantProps) {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError("");
    setResponse("");

    try {
      const result = await createChatCompletion([
        {
          role: "system",
          content:
            "당신은 창의적이고 도움이 되는 AI 어시스턴트입니다. 사용자의 요청에 대해 명확하고 유용한 답변을 제공해주세요.",
        },
        {
          role: "user",
          content: prompt,
        },
      ]);

      setResponse(result.content);
      if (onContentGenerated) {
        onContentGenerated(result.content);
      }
    } catch (err) {
      const errorMessage = handleOpenAIError(err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = async (quickPrompt: string) => {
    setPrompt(quickPrompt);
    // 자동으로 실행
    setTimeout(() => {
      const form = document.querySelector("form");
      if (form) {
        form.dispatchEvent(new Event("submit", { bubbles: true }));
      }
    }, 100);
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-semibold">AI 어시스턴트</h3>
      </div>

      {/* 빠른 프롬프트 버튼들 */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            handleQuickPrompt("블로그 포스트 아이디어를 제안해주세요")
          }
          disabled={isLoading}
        >
          블로그 아이디어
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleQuickPrompt("제목을 더 매력적으로 만들어주세요")}
          disabled={isLoading}
        >
          제목 개선
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleQuickPrompt("내용을 요약해주세요")}
          disabled={isLoading}
        >
          내용 요약
        </Button>
      </div>

      {/* 프롬프트 입력 폼 */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="AI에게 무엇을 도와달라고 할까요?"
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !prompt.trim()}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>

      {/* 에러 메시지 */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* AI 응답 */}
      {response && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
          <h4 className="font-medium text-blue-900 mb-2">AI 응답:</h4>
          <p className="text-blue-800 text-sm whitespace-pre-wrap">
            {response}
          </p>
          <div className="mt-3 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(response);
              }}
            >
              복사
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setResponse("");
                setPrompt("");
              }}
            >
              새로고침
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
