/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { useEditPost } from "../model/useEditPost";
import { Tiptap } from "@/entities/TextEditor/index";
import { Content } from "@/entities/Content/index";

export default function CreatePostForm() {
  const { content, setContent, currentContentId, createContent, saveContent } =
    useEditPost("");
  const [savedContent, setSavedContent] = useState<Content | null>(null);
  useEffect(() => {
    const newContent = createContent();
    setSavedContent(newContent);
  }, []);
  useEffect(() => {
    if (content && currentContentId) {
      const saved = saveContent(content, currentContentId);
      if (saved) {
        setSavedContent(saved);
      }
    }
  }, [content, currentContentId]);
  const handleSave = () => {
    if (content) {
      const saved = saveContent(content, currentContentId || undefined);
      if (saved) {
        setSavedContent(saved);
        alert("저장되었습니다!");
      }
    }
  };
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 min-h-0">
        <Tiptap setContent={setContent} />
      </div>
      <div className="mt-4">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          저장하기
        </button>
        {savedContent && (
          <div className="mt-2 text-sm text-gray-600">
            마지막 저장: {savedContent.updatedAt.toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
}
