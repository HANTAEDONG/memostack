import { Editor } from "@tiptap/react";

// 필요한 아이콘들만 정의 (타입 전용)
type ToolbarIconNames =
  | "Undo"
  | "Redo"
  | "Code"
  | "Quote"
  | "Bold"
  | "Italic"
  | "Underline"
  | "Strikethrough"
  | "Highlighter"
  | "Link"
  | "AlignLeft"
  | "AlignCenter"
  | "AlignRight"
  | "AlignJustify"
  | "Heading1"
  | "Heading2"
  | "Heading3"
  | "ListOrdered"
  | "List"
  | "SquareCheck"
  | "Minus"
  | "Unlink"
  | "MousePointer"
  | "Trash"
  | "Sun"
  | "Moon";

export type MarkType =
  | "bold"
  | "italic"
  | "underline"
  | "strike"
  | "code"
  | "link"
  | "highlight";

export type NodeType =
  | "codeBlock"
  | "blockquote"
  | "orderedList"
  | "bulletList"
  | "taskList"
  | "link";

export type HeadingLevel = 1 | 2 | 3;
export type TextAlign = "left" | "center" | "right" | "justify";

export interface ActiveMarks extends Record<MarkType, boolean> {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strike: boolean;
  code: boolean;
  link: boolean;
  highlight: boolean;
}

export interface ActiveNodes extends Record<NodeType, boolean> {
  heading: HeadingLevel | null;
  textAlign: TextAlign | null;
  highlight: boolean;
}

export interface EditorState {
  activeMarks: ActiveMarks;
  activeNodes: ActiveNodes;
}

export interface ToolbarOption {
  id: string;
  label: string;
  icon: ToolbarIconNames;
  type: "mark" | "node" | "action";
  action: (editor: Editor) => void;
  isActive?: (editor: Editor) => boolean;
  isDisabled?: (editor: Editor) => boolean;
}

export interface EditorAction {
  toggleHeading: (level: HeadingLevel) => void;
  toggleBold: () => void;
  toggleItalic: () => void;
  toggleUnderline: () => void;
  toggleStrike: () => void;
  toggleCode: () => void;
  toggleCodeBlock: () => void;
  toggleBlockquote: () => void;
  toggleOrderedList: () => void;
  toggleBulletList: () => void;
  toggleTaskList: () => void;
  setHorizontalRule: () => void;
  setTextAlign: (align: TextAlign) => void;
  toggleHighlight: () => void;
  setLink: (href: string) => void;
  unsetLink: () => void;
  undo: () => void;
  redo: () => void;
  selectAll: () => void;
  clearContent: () => void;
  focus: () => void;
}

export interface DropdownOption {
  key: string;
  element: React.ReactNode;
  isActive: boolean;
  action: () => void;
}
