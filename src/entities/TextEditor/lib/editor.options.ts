import { ToolbarOption } from "../lib/editor.types";

export const headingOptions: ToolbarOption[] = [
  {
    id: "heading-1",
    label: "제목 1",
    icon: "Heading1",
    type: "node",
    action: (editor) =>
      editor.chain().focus().toggleHeading({ level: 1 }).run(),
    isActive: (editor) => editor.isActive("heading", { level: 1 }),
  },
  {
    id: "heading-2",
    label: "제목 2",
    icon: "Heading2",
    type: "node",
    action: (editor) =>
      editor.chain().focus().toggleHeading({ level: 2 }).run(),
    isActive: (editor) => editor.isActive("heading", { level: 2 }),
  },
  {
    id: "heading-3",
    label: "제목 3",
    icon: "Heading3",
    type: "node",
    action: (editor) =>
      editor.chain().focus().toggleHeading({ level: 3 }).run(),
    isActive: (editor) => editor.isActive("heading", { level: 3 }),
  },
];

export const listOptions: ToolbarOption[] = [
  {
    id: "ordered-list",
    label: "순서 있는 목록",
    icon: "ListOrdered",
    type: "node",
    action: (editor) => editor.chain().focus().toggleOrderedList().run(),
    isActive: (editor) => editor.isActive("orderedList"),
  },
  {
    id: "bullet-list",
    label: "순서 없는 목록",
    icon: "List",
    type: "node",
    action: (editor) => editor.chain().focus().toggleBulletList().run(),
    isActive: (editor) => editor.isActive("bulletList"),
  },
  // {
  //   id: "task-list",
  //   label: "할 일 목록",
  //   icon: "SquareCheck",
  //   type: "node",
  //   action: (editor) => editor.chain().focus().toggleTaskList().run(),
  //   isActive: (editor) => editor.isActive("taskList"),
  // },
];

export const toolbarOptions: Record<string, ToolbarOption> = {
  bold: {
    id: "bold",
    label: "굵게",
    icon: "Bold",
    type: "mark",
    action: (editor) => editor.chain().focus().toggleBold().run(),
    isActive: (editor) => editor.isActive("bold"),
  },
  italic: {
    id: "italic",
    label: "기울임",
    icon: "Italic",
    type: "mark",
    action: (editor) => editor.chain().focus().toggleItalic().run(),
    isActive: (editor) => editor.isActive("italic"),
  },
  underline: {
    id: "underline",
    label: "밑줄",
    icon: "Underline",
    type: "mark",
    action: (editor) => editor.chain().focus().toggleUnderline().run(),
    isActive: (editor) => editor.isActive("underline"),
  },
  strike: {
    id: "strike",
    label: "취소선",
    icon: "Strikethrough",
    type: "mark",
    action: (editor) => editor.chain().focus().toggleStrike().run(),
    isActive: (editor) => editor.isActive("strike"),
  },
  code: {
    id: "code",
    label: "인라인 코드",
    icon: "Code",
    type: "mark",
    action: (editor) => editor.chain().focus().toggleCode().run(),
    isActive: (editor) => editor.isActive("code"),
  },
  codeBlock: {
    id: "code-block",
    label: "코드 블록",
    icon: "Code",
    type: "node",
    action: (editor) => editor.chain().focus().toggleCodeBlock().run(),
    isActive: (editor) => editor.isActive("codeBlock"),
  },
  blockquote: {
    id: "blockquote",
    label: "인용구",
    icon: "Quote",
    type: "node",
    action: (editor) => editor.chain().focus().toggleBlockquote().run(),
    isActive: (editor) => editor.isActive("blockquote"),
  },
  horizontalRule: {
    id: "horizontal-rule",
    label: "구분선",
    icon: "Minus",
    type: "action",
    action: (editor) => editor.chain().focus().setHorizontalRule().run(),
  },
  link: {
    id: "link",
    label: "링크 추가",
    icon: "Link",
    type: "node",
    action: (editor) => {
      const url = window.prompt("URL을 입력하세요:");
      if (url) {
        editor.chain().focus().setLink({ href: url }).run();
      }
    },
    isActive: (editor) => editor.isActive("link"),
  },
  highlight: {
    id: "highlight",
    label: "하이라이트",
    icon: "Highlighter",
    type: "mark",
    action: (editor) => editor.chain().focus().toggleHighlight().run(),
    isActive: (editor) => editor.isActive("highlight"),
  },
  unlink: {
    id: "unlink",
    label: "링크 제거",
    icon: "Unlink",
    type: "action",
    action: (editor) => editor.chain().focus().unsetLink().run(),
    isActive: (editor) => editor.isActive("link"),
  },
  undo: {
    id: "undo",
    label: "실행 취소",
    icon: "Undo",
    type: "action",
    action: (editor) => editor.chain().focus().undo().run(),
    isDisabled: (editor) => !editor.can().undo(),
  },
  redo: {
    id: "redo",
    label: "다시 실행",
    icon: "Redo",
    type: "action",
    action: (editor) => editor.chain().focus().redo().run(),
    isDisabled: (editor) => !editor.can().redo(),
  },
  selectAll: {
    id: "select-all",
    label: "전체 선택",
    icon: "MousePointer",
    type: "action",
    action: (editor) => editor.chain().focus().selectAll().run(),
  },
  clearContent: {
    id: "clear-content",
    label: "내용 지우기",
    icon: "Trash",
    type: "action",
    action: (editor) => editor.chain().focus().clearContent().run(),
  },
  textAlignLeft: {
    id: "text-align-left",
    label: "텍스트 정렬",
    icon: "AlignLeft",
    type: "action",
    action: (editor) => editor.chain().focus().setTextAlign("left").run(),
  },
  textAlignCenter: {
    id: "text-align-center",
    label: "텍스트 정렬",
    icon: "AlignCenter",
    type: "action",
    action: (editor) => editor.chain().focus().setTextAlign("center").run(),
  },
  textAlignRight: {
    id: "text-align-right",
    label: "텍스트 정렬",
    icon: "AlignRight",
    type: "action",
    action: (editor) => editor.chain().focus().setTextAlign("right").run(),
  },
};
