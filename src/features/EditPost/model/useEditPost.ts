"use client";

import { StorageService } from "@/entities/Storage";
import { useState, useRef } from "react";

export const useEditPost = (initialContent: string) => {
  const [content, setContent] = useState(initialContent);
  const storageServiceRef = useRef<StorageService | null>(null);

  const StorageServiceInstance = () => {
    if (typeof window === "undefined") {
      return null;
    }
    if (!storageServiceRef.current) {
      storageServiceRef.current = new StorageService();
    }
    return storageServiceRef.current;
  };

  const createDraft = () => {
    const storageService = StorageServiceInstance();
    if (storageService) {
      const draft = storageService.createDraft();
      return draft;
    }
    return null;
  };

  const handleAutoSave = (content: string, id?: string) => {
    const storageService = StorageServiceInstance();
    if (storageService) {
      storageService.saveDraft(content, id);
    }
  };

  return {
    content,
    setContent,
    handleAutoSave,
    createDraft,
  };
};
