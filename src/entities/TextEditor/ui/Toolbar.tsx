import { Italic, Redo, Strikethrough, Underline } from "lucide-react";
import { Editor } from "@tiptap/react";
import { getEditorActions } from "../lib/editor.actions";
import ToolbarButton from "./ToolbarButton";
import LucideIcon from "@/shared/ui/Icon/LucideIcon";
import ToolbarDropDown from "./ToolbarDropDown";
import { useRef } from "react";
import { useEditorState } from "../lib/useEditorState";
import {
  headingOptions,
  getActiveOptions,
  listOptions,
} from "../lib/editor.options";

const Toolbar = ({ editor }: { editor: Editor }) => {
  const actions = getEditorActions(editor);
  const ref = useRef<HTMLDivElement>(null);
  const { editorState } = useEditorState(editor);

  const activeOptions = getActiveOptions(editor);
  console.log(
    "현재 활성화된 옵션들:",
    activeOptions.map((opt) => opt.label)
  );

  return (
    <div className="w-full h-[44px] relative flex justify-center items-center bg-white dark:bg-[rgb(14, 14, 17)] border-b border-gray-200">
      <div
        className="flex gap-2 dark:text-white"
        style={{ color: "rgb(14, 14, 17)" }}
      >
        <div className="flex gap-1 border-r border-gray-200 pr-2">
          <ToolbarButton
            className={`w-8 h-8 flex items-center justify-center ${
              editor?.can().undo() ? "text-white" : "text-gray-500"
            }`}
            onClick={() => {
              actions?.undo();
            }}
            disabled={!editor?.can().undo()}
          >
            <LucideIcon name="Undo" />
          </ToolbarButton>
          <ToolbarButton
            className={`w-8 h-8 flex items-center justify-center ${
              editor?.can().redo() ? "text-white" : "text-gray-500"
            }`}
            onClick={() => actions?.redo()}
            disabled={!editor?.can().redo()}
          >
            <Redo size={16} />
          </ToolbarButton>
        </div>
        <div className="flex gap-1 border-r border-gray-200 pr-2">
          <ToolbarDropDown options={headingOptions} editor={editor} ref={ref} />
          <ToolbarDropDown options={listOptions} editor={editor} ref={ref} />
        </div>
        <div className="flex gap-1 border-r border-gray-200 pr-2">
          <ToolbarButton onClick={() => actions?.toggleBold()}>
            <LucideIcon
              name="Bold"
              className={`${
                editorState.activeMarks.bold ? "text-blue-500" : "text-black"
              }`}
            />
          </ToolbarButton>
          <ToolbarButton onClick={() => actions?.toggleItalic()}>
            <Italic
              size={16}
              className={`${
                editorState.activeMarks.italic ? "text-blue-500" : "text-black"
              }`}
            />
          </ToolbarButton>
          <ToolbarButton onClick={() => actions?.toggleUnderline()}>
            <Underline
              size={16}
              className={`${
                editorState.activeMarks.underline
                  ? "text-blue-500"
                  : "text-black"
              }`}
            />
          </ToolbarButton>
          <ToolbarButton onClick={() => actions?.toggleStrike()}>
            <Strikethrough
              size={16}
              className={`${
                editorState.activeMarks.strike ? "text-blue-500" : "text-black"
              }`}
            />
          </ToolbarButton>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
