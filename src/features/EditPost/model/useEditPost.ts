"use client";

import { Content } from "@/entities/Content";
import { EditPostService } from "./EditPost.service";
import { useState, useRef } from "react";

export const useEditPost = (initialContent: string) => {
  const [content, setContent] = useState(initialContent);
  const [currentContentId, setCurrentContentId] = useState<string | null>(null);
  const editPostServiceRef = useRef<EditPostService | null>(null);
  const EditPostInstance = () => {
    if (!editPostServiceRef.current) {
      editPostServiceRef.current = new EditPostService();
    }
    return editPostServiceRef.current;
  };
  const createContent = (): Content | null => {
    const editPostService = EditPostInstance();
    const newContent = editPostService.createContent(content);
    setCurrentContentId(newContent.id);
    return newContent;
  };
  const saveContent = (contentToSave: string, id?: string): Content | null => {
    const editPostService = EditPostInstance();
    const contentId = id || currentContentId;
    const savedContent = editPostService.saveContent(
      contentToSave,
      contentId || undefined
    );
    if (!contentId) {
      setCurrentContentId(savedContent.id);
    }
    return savedContent;
  };
  return {
    content,
    setContent,
    currentContentId,
    createContent,
    saveContent,
  };
};
