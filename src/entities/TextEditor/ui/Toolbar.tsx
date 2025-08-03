import { Editor } from "@tiptap/react";
import ToolbarButton from "./ToolbarButton";
import ToolbarIcon from "./ToolbarIcon";
import ToolbarDropDown from "./ToolbarDropDown";
import { useRef, useState } from "react";
import { useEditorState } from "../model/useEditorState";

import {
  headingOptions,
  listOptions,
  toolbarOptions,
} from "../model/editor.options";
import Card from "@/shared/ui/Card/Card";

interface ToolbarProps {
  editor: Editor;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Toolbar = ({ editor, isDarkMode, toggleDarkMode }: ToolbarProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { editorState } = useEditorState(editor);
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [mention, setMention] = useState("");
  return (
    <div className="w-full h-[44px] relative border-b border-gray-200 rounded-t-lg">
      <div
        className="w-full h-full overflow-x-auto"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <div
          className="flex gap-2 dark:text-white min-w-max px-4 whitespace-nowrap h-full items-center"
          style={{ color: "rgb(14, 14, 17)" }}
        >
          <div className="flex gap-1 border-r border-gray-200 pr-2">
            <ToolbarButton
              className={`w-8 h-8 flex items-center justify-center`}
              onClick={() => {
                toolbarOptions.undo.action(editor);
              }}
              disabled={!editor?.can().undo()}
            >
              <ToolbarIcon
                name="Undo"
                className={`${
                  editor?.can().undo()
                    ? "text-gray-700 dark:text-[oklch(90%_0_0)]"
                    : "text-gray-300 dark:text-gray-500"
                }`}
              />
            </ToolbarButton>
            <ToolbarButton
              className={`w-8 h-8 flex items-center justify-center`}
              onClick={() => {
                toolbarOptions.redo.action(editor);
              }}
              disabled={!editor?.can().redo()}
            >
              <ToolbarIcon
                name="Redo"
                className={`${
                  editor?.can().redo()
                    ? "text-gray-700 dark:text-[oklch(90%_0_0)]"
                    : "text-gray-300 dark:text-gray-500"
                }`}
              />
            </ToolbarButton>
          </div>
          <div className="flex gap-1 border-r border-gray-200 pr-2">
            <ToolbarDropDown
              options={headingOptions}
              editor={editor}
              ref={ref}
            />
            <ToolbarDropDown options={listOptions} editor={editor} ref={ref} />
            <ToolbarButton
              onClick={() => {
                toolbarOptions.codeBlock.action(editor);
              }}
            >
              <ToolbarIcon name="Code" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => {
                toolbarOptions.blockquote.action(editor);
              }}
            >
              <ToolbarIcon
                name="Quote"
                isActive={editorState.activeNodes.blockquote}
              />
            </ToolbarButton>
          </div>
          <div className="flex gap-1 border-r border-gray-200 pr-2">
            <ToolbarButton
              onClick={() => {
                toolbarOptions.bold.action(editor);
              }}
            >
              <ToolbarIcon
                name="Bold"
                isActive={editorState.activeMarks.bold}
              />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => {
                toolbarOptions.italic.action(editor);
              }}
            >
              <ToolbarIcon
                name="Italic"
                isActive={editorState.activeMarks.italic}
              />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => {
                toolbarOptions.underline.action(editor);
              }}
            >
              <ToolbarIcon
                name="Underline"
                isActive={editorState.activeMarks.underline}
              />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => {
                toolbarOptions.strike.action(editor);
              }}
            >
              <ToolbarIcon
                name="Strikethrough"
                isActive={editorState.activeMarks.strike}
              />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => {
                toolbarOptions.highlight.action(editor);
              }}
            >
              <ToolbarIcon
                name="Highlighter"
                isActive={editorState.activeMarks.highlight}
              />
            </ToolbarButton>
            {/* <ToolbarButton
            onClick={useCallback(() => actions?.setLink(), [actions])}
          >
            <ToolbarIcon name="Link" isActive={editorState.activeMarks.link} />
          </ToolbarButton> */}
            <ToolbarButton onClick={() => setOpen(true)}>
              <ToolbarIcon
                name="Link"
                isActive={editorState.activeMarks.link}
              />
              {open && (
                <Card className="absolute top-10 left-0 w-95 z-10 px-6 py-3">
                  <div className="flex flex-col gap-2 w-fit">
                    <div className="flex flex-col gap-1">
                      <div className="text-sm font-semibold text-start">
                        URL
                      </div>
                      <input
                        className="w-83 h-full outline-none border border-gray-300 focus:border-gray-400 dark:border-gray-500 px-2 py-2 rounded-md bg-gray-200 opacity-80 dark:bg-gray-800 text-md"
                        placeholder="example.com"
                        value={url}
                        onChange={(e) => {
                          setUrl(e.target.value);
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="text-sm font-semibold text-start">
                        Mention
                      </div>
                      <input
                        className="w-full h-full outline-none border border-gray-300 focus:border-gray-400 dark:border-gray-500 px-2 py-2 rounded-md bg-gray-200 opacity-80 dark:bg-gray-800 text-md"
                        placeholder="example"
                        value={mention}
                        onChange={(e) => {
                          setMention(e.target.value);
                        }}
                      />
                    </div>
                    <div className="flex gap-2 justify-center">
                      <button className="w-full h-full outline-none border border-gray-300 focus:border-gray-400 dark:border-gray-500 px-2 py-2 rounded-md bg-gray-200 opacity-80 dark:bg-gray-800 text-md">
                        Cancel
                      </button>
                      <button className="w-full h-full outline-none border border-gray-300 focus:border-gray-400 dark:border-gray-500 px-2 py-2 rounded-md bg-blue-500 text-white text-semibold">
                        Apply
                      </button>
                    </div>
                  </div>
                </Card>
              )}
            </ToolbarButton>
          </div>
          <div className="flex gap-1 border-r border-gray-200 pr-2">
            <ToolbarButton
              onClick={() => {
                toolbarOptions.textAlignLeft.action(editor);
              }}
            >
              <ToolbarIcon
                name="AlignLeft"
                isActive={editorState.activeNodes.textAlign === "left"}
              />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => {
                toolbarOptions.textAlignCenter.action(editor);
              }}
            >
              <ToolbarIcon name="AlignCenter" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => {
                toolbarOptions.textAlignRight.action(editor);
              }}
            >
              <ToolbarIcon name="AlignRight" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => {
                toolbarOptions.textAlignJustify.action(editor);
              }}
            >
              <ToolbarIcon name="AlignJustify" />
            </ToolbarButton>
          </div>
          <div>
            <ToolbarButton onClick={toggleDarkMode}>
              <ToolbarIcon name={isDarkMode ? "Sun" : "Moon"} />
            </ToolbarButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
