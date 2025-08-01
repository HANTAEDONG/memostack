import { Editor } from "@tiptap/react";
import ToolbarButton from "./ToolbarButton";
import ToolbarIcon from "./ToolbarIcon";
import ToolbarDropDown from "./ToolbarDropDown";
import { useRef } from "react";
import { useEditorState } from "../model/useEditorState";
import { getEditorActions } from "../model/editor.actions";
import {
  getActiveOptions,
  headingOptions,
  listOptions,
} from "../model/editor.options";

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
            <ToolbarIcon name="Undo" />
          </ToolbarButton>
          <ToolbarButton
            className={`w-8 h-8 flex items-center justify-center ${
              editor?.can().redo() ? "text-white" : "text-gray-500"
            }`}
            onClick={() => actions?.redo()}
            disabled={!editor?.can().redo()}
          >
            <ToolbarIcon name="Redo" />
          </ToolbarButton>
        </div>
        <div className="flex gap-1 border-r border-gray-200 pr-2">
          <ToolbarDropDown options={headingOptions} editor={editor} ref={ref} />
          <ToolbarDropDown options={listOptions} editor={editor} ref={ref} />
          <ToolbarButton onClick={() => actions?.toggleCodeBlock()}>
            <ToolbarIcon name="Code" />
          </ToolbarButton>
          <ToolbarButton onClick={() => actions?.toggleBlockquote()}>
            <ToolbarIcon
              name="Quote"
              isActive={editorState.activeNodes.blockquote}
            />
          </ToolbarButton>
        </div>
        <div className="flex gap-1 border-r border-gray-200 pr-2">
          <ToolbarButton onClick={() => actions?.toggleBold()}>
            <ToolbarIcon name="Bold" isActive={editorState.activeMarks.bold} />
          </ToolbarButton>
          <ToolbarButton onClick={() => actions?.toggleItalic()}>
            <ToolbarIcon
              name="Italic"
              isActive={editorState.activeMarks.italic}
            />
          </ToolbarButton>
          <ToolbarButton onClick={() => actions?.toggleUnderline()}>
            <ToolbarIcon
              name="Underline"
              isActive={editorState.activeMarks.underline}
            />
          </ToolbarButton>
          <ToolbarButton onClick={() => actions?.toggleStrike()}>
            <ToolbarIcon
              name="Strikethrough"
              isActive={editorState.activeMarks.strike}
            />
          </ToolbarButton>
          <ToolbarButton onClick={() => actions?.toggleHighlight()}>
            <ToolbarIcon
              name="Highlighter"
              isActive={editorState.activeMarks.highlight}
            />
          </ToolbarButton>
          <ToolbarButton onClick={() => actions?.toggleLink()}>
            <ToolbarIcon name="Link" isActive={editorState.activeMarks.link} />
          </ToolbarButton>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
