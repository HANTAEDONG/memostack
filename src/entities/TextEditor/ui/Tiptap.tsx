"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import EditorOptions from "../lib/EditorOptions";
import ToolbarComponent from "./ToolbarComponent";
import useToggleDarkmode from "@/shared/hooks/useToggleDarkmode";
import { Input } from "@/shared/ui/shadcn/input";
import { useEffect, useRef, useState, useCallback } from "react";
import CategoryInlineSelect from "@/entities/Post/ui/CategoryInlineSelect";
import { Category } from "@/entities/Post/lib/category.types";
import { filterImageFiles, handleImageDrop } from "../lib/image-handler";

interface TiptapProps {
  title: string;
  content: string;
  category: Category;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onCategoryChange: (category: Category) => void;
}

const Tiptap = ({
  title,
  content,
  category,
  onTitleChange,
  onContentChange,
  onCategoryChange,
}: TiptapProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [thumbLeft, setThumbLeft] = useState<number>(0);
  const [thumbWidth, setThumbWidth] = useState<number>(100);
  const editor = useEditor({
    ...EditorOptions,
    content: content,
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML();
      onContentChange(newContent);
    },
  });

  // content prop이 변경될 때 에디터 내용 업데이트
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const { isDarkMode, setTheme } = useToggleDarkmode();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    onTitleChange(newTitle);
  };

  // 드래그 앤 드롭 핸들러
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const files = filterImageFiles(e.dataTransfer.files);

      if (files.length === 0 || !editor) return;

      handleImageDrop(editor, files);
    },
    [editor]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  // 스크롤 진행도 업데이트
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const updateProgress = () => {
      const clientH = el.clientHeight;
      const scrollH = el.scrollHeight;
      const scrollT = el.scrollTop;

      const trackPadding = 16 * 2; // px-4 (4*4px)
      const trackW = Math.max(0, el.clientWidth - trackPadding);
      const ratio = scrollH > 0 ? clientH / scrollH : 1;
      const computedThumbW = Math.max(60, Math.min(trackW, trackW * ratio));
      const maxThumbLeft = Math.max(0, trackW - computedThumbW);
      const scrollRange = Math.max(1, scrollH - clientH);
      const computedLeft = (scrollT / scrollRange) * maxThumbLeft;

      setThumbWidth(computedThumbW);
      setThumbLeft(computedLeft);
    };

    updateProgress();
    el.addEventListener("scroll", updateProgress);

    const ro = new ResizeObserver(() => updateProgress());
    ro.observe(el);
    window.addEventListener("resize", updateProgress);

    return () => {
      el.removeEventListener("scroll", updateProgress);
      ro.disconnect();
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return (
    <div className="relative border border-gray-200 rounded-lg flex flex-col min-h-0 h-full">
      {editor && (
        <ToolbarComponent
          editor={editor}
          isDarkMode={isDarkMode}
          setTheme={setTheme}
        />
      )}
      {/* Horizontal progress bar */}
      <div className="px-4 py-1">
        <div className="relative h-1 bg-gray-200 dark:bg-gray-700 rounded-full">
          <div
            className="absolute top-0 h-full bg-black dark:bg-gray-900 rounded-full transition-all duration-150"
            style={{ left: `${thumbLeft}px`, width: `${thumbWidth}px` }}
          />
        </div>
      </div>
      <div className="w-full pt-4 px-3 sm:px-5 focus:outline-none">
        <Input
          name="title"
          id="title"
          placeholder="제목"
          value={title}
          className="w-full border-none focus:outline-none h-12 px-0 py-0 font-bold placeholder:text-gray-400 !text-3xl sm:!text-4xl mb-3"
          onChange={handleTitleChange}
        />
        <div className="w-full max-w-xs">
          <CategoryInlineSelect
            value={category}
            onValueChange={onCategoryChange}
            placeholder="카테고리"
          />
        </div>
      </div>
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto pb-4"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <EditorContent
          id="editor"
          editor={editor}
          className="w-full h-full p-0 focus:outline-none [&_.ProseMirror]:h-full [&_.ProseMirror]:min-h-0 [&_.ProseMirror]:px-0 sm:[&_.ProseMirror]:px-0 [&_.ProseMirror]:py-0 sm:[&_.ProseMirror]:py-0 "
        />
      </div>
    </div>
  );
};

export default Tiptap;
