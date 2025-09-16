"use client";
import React, { useState } from "react";
import { useCreateDraft } from "../model/usePostQuery";
import { Button } from "@/shared/ui/shadcn/button";
import { Input } from "@/shared/ui/shadcn/input";
import { Label } from "@/shared/ui/shadcn/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/shadcn/Card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/shadcn/select";

export const CreateDraftForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("general");
  const createDraftMutation = useCreateDraft();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      await createDraftMutation.mutateAsync({
        title: title.trim(),
        content: content.trim(),
        category,
      });

      setTitle("");
      setContent("");
      setCategory("general");
      alert("Draft post가 성공적으로 생성되었습니다!");
    } catch (error) {
      console.error("드래프트 생성 실패:", error);
      alert("드래프트 생성에 실패했습니다.");
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>새 Draft Post 생성</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {createDraftMutation.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-800 text-sm">
                {createDraftMutation.error.message}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="포스트 제목을 입력하세요"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">카테고리</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="카테고리를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">일반</SelectItem>
                <SelectItem value="tech">기술</SelectItem>
                <SelectItem value="life">일상</SelectItem>
                <SelectItem value="review">리뷰</SelectItem>
                <SelectItem value="tutorial">튜토리얼</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">내용</Label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="포스트 내용을 입력하세요"
              className="w-full min-h-[200px] p-3 border border-gray-300 rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={
                createDraftMutation.isPending ||
                !title.trim() ||
                !content.trim()
              }
              className="flex-1"
            >
              {createDraftMutation.isPending ? "생성 중..." : "Draft 생성"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setTitle("");
                setContent("");
                setCategory("general");
              }}
              className="flex-1"
            >
              초기화
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
