import { Editor } from "@tiptap/react";
import { ToolbarOption } from "../model/editor.types";
import { EditorActionInstance } from "./editor.actions";

export const headingOptions: ToolbarOption[] = [
  {
    id: "heading-1",
    label: "제목 1",
    icon: "Heading1",
    type: "node",
    action: (editor) => EditorActionInstance(editor)?.toggleHeading(1),
    isActive: (editor) => editor.isActive("heading", { level: 1 }),
  },
  {
    id: "heading-2",
    label: "제목 2",
    icon: "Heading2",
    type: "node",
    action: (editor) => EditorActionInstance(editor)?.toggleHeading(2),
    isActive: (editor) => editor.isActive("heading", { level: 2 }),
  },
  {
    id: "heading-3",
    label: "제목 3",
    icon: "Heading3",
    type: "node",
    action: (editor) => EditorActionInstance(editor)?.toggleHeading(3),
    isActive: (editor) => editor.isActive("heading", { level: 3 }),
  },
];

export const listOptions: ToolbarOption[] = [
  {
    id: "ordered-list",
    label: "순서 있는 목록",
    icon: "ListOrdered",
    type: "node",
    action: (editor) => EditorActionInstance(editor)?.toggleOrderedList(),
    isActive: (editor) => editor.isActive("orderedList"),
  },
  {
    id: "bullet-list",
    label: "순서 없는 목록",
    icon: "List",
    type: "node",
    action: (editor) => EditorActionInstance(editor)?.toggleBulletList(),
    isActive: (editor) => editor.isActive("bulletList"),
  },
  {
    id: "task-list",
    label: "할 일 목록",
    icon: "SquareCheck",
    type: "node",
    action: (editor) => EditorActionInstance(editor)?.toggleTaskList(),
    isActive: (editor) => editor.isActive("taskList"),
  },
];

export const toolbarOptions: ToolbarOption[] = [
  {
    id: "bold",
    label: "굵게",
    icon: "Bold",
    type: "mark",
    action: (editor) => EditorActionInstance(editor)?.toggleBold(),
    isActive: (editor) => editor.isActive("bold"),
  },
  {
    id: "italic",
    label: "기울임",
    icon: "Italic",
    type: "mark",
    action: (editor) => EditorActionInstance(editor)?.toggleItalic(),
    isActive: (editor) => editor.isActive("italic"),
  },
  {
    id: "underline",
    label: "밑줄",
    icon: "Underline",
    type: "mark",
    action: (editor) => EditorActionInstance(editor)?.toggleUnderline(),
    isActive: (editor) => editor.isActive("underline"),
  },
  {
    id: "strike",
    label: "취소선",
    icon: "Strikethrough",
    type: "mark",
    action: (editor) => EditorActionInstance(editor)?.toggleStrike(),
    isActive: (editor) => editor.isActive("strike"),
  },
  {
    id: "code",
    label: "인라인 코드",
    icon: "Code",
    type: "mark",
    action: (editor) => EditorActionInstance(editor)?.toggleCode(),
    isActive: (editor) => editor.isActive("code"),
  },

  {
    id: "code-block",
    label: "코드 블록",
    icon: "Code",
    type: "node",
    action: (editor) => EditorActionInstance(editor)?.toggleCodeBlock(),
    isActive: (editor) => editor.isActive("codeBlock"),
  },
  {
    id: "blockquote",
    label: "인용구",
    icon: "Quote",
    type: "node",
    action: (editor) => EditorActionInstance(editor)?.toggleBlockquote(),
    isActive: (editor) => editor.isActive("blockquote"),
  },
  {
    id: "horizontal-rule",
    label: "구분선",
    icon: "Minus",
    type: "action",
    action: (editor) => EditorActionInstance(editor)?.setHorizontalRule(),
  },
  {
    id: "link",
    label: "링크 추가",
    icon: "Link",
    type: "node",
    action: (editor) => {
      const url = window.prompt("URL을 입력하세요:");
      if (url) {
        EditorActionInstance(editor)?.setLink();
      }
    },
    isActive: (editor) => editor.isActive("link"),
  },
  {
    id: "highlight",
    label: "하이라이트",
    icon: "Highlighter",
    type: "mark",
    action: (editor) => EditorActionInstance(editor)?.toggleHighlight(),
    isActive: (editor) => editor.isActive("highlight"),
  },
  {
    id: "unlink",
    label: "링크 제거",
    icon: "Unlink",
    type: "action",
    action: (editor) => EditorActionInstance(editor)?.unsetLink(),
    isActive: (editor) => editor.isActive("link"),
  },
  {
    id: "undo",
    label: "실행 취소",
    icon: "Undo",
    type: "action",
    action: (editor) => EditorActionInstance(editor)?.undo(),
    isDisabled: (editor) => !editor.can().undo(),
  },
  {
    id: "redo",
    label: "다시 실행",
    icon: "Redo",
    type: "action",
    action: (editor) => EditorActionInstance(editor)?.redo(),
    isDisabled: (editor) => !editor.can().redo(),
  },
  {
    id: "select-all",
    label: "전체 선택",
    icon: "MousePointer",
    type: "action",
    action: (editor) => EditorActionInstance(editor)?.selectAll(),
  },
  {
    id: "clear-content",
    label: "내용 지우기",
    icon: "Trash",
    type: "action",
    action: (editor) => EditorActionInstance(editor)?.clearContent(),
  },
  {
    id: "text-align-left",
    label: "텍스트 정렬",
    icon: "AlignLeft",
    type: "action",
    action: (editor) => EditorActionInstance(editor)?.setTextAlign("left"),
  },
  {
    id: "text-align-center",
    label: "텍스트 정렬",
    icon: "AlignCenter",
    type: "action",
    action: (editor) => EditorActionInstance(editor)?.setTextAlign("center"),
  },
  {
    id: "text-align-right",
    label: "텍스트 정렬",
    icon: "AlignRight",
    type: "action",
    action: (editor) => EditorActionInstance(editor)?.setTextAlign("right"),
  },
];

export const findToolbarOption = (id: string): ToolbarOption | undefined => {
  return toolbarOptions.find((option) => option.id === id);
};

export const getActiveOptions = (editor: Editor): ToolbarOption[] => {
  return toolbarOptions.filter(
    (option) => option.isActive && option.isActive(editor)
  );
};
