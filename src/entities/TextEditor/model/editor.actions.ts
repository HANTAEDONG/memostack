import { Editor } from "@tiptap/react";
import { EditorAction, TextAlign } from "../model/editor.types";

export class EditorActions implements EditorAction {
  protected editor: Editor;
  constructor(editor: Editor) {
    this.editor = editor;
  }
  static create(editor: Editor): EditorActions {
    return new EditorActions(editor);
  }
  toggleHeading(level: 1 | 2 | 3) {
    return this.editor.chain().focus().toggleHeading({ level }).run();
  }
  toggleBold() {
    return this.editor.chain().focus().toggleBold().run();
  }
  toggleItalic() {
    return this.editor.chain().focus().toggleItalic().run();
  }
  toggleUnderline() {
    return this.editor.chain().focus().toggleUnderline().run();
  }
  toggleStrike() {
    return this.editor.chain().focus().toggleStrike().run();
  }
  toggleCode() {
    return this.editor.chain().focus().toggleCode().run();
  }
  toggleCodeBlock() {
    return this.editor.chain().focus().toggleCodeBlock().run();
  }
  toggleBlockquote() {
    return this.editor.chain().focus().toggleBlockquote().run();
  }
  toggleOrderedList() {
    return this.editor.chain().focus().toggleOrderedList().run();
  }
  toggleBulletList() {
    return this.editor.chain().focus().toggleBulletList().run();
  }
  toggleTaskList() {
    return this.editor.chain().focus().toggleTaskList().run();
  }
  setHorizontalRule() {
    return this.editor.chain().focus().setHorizontalRule().run();
  }
  toggleHighlight() {
    return this.editor.chain().focus().toggleHighlight().run();
  }
  toggleLink() {
    return this.editor.chain().focus().toggleLink().run();
  }
  setLink(href: string) {
    return this.editor.chain().focus().setLink({ href }).run();
  }
  unsetLink() {
    return this.editor.chain().focus().unsetLink().run();
  }
  // setImage(src: string, alt?: string) {
  //   return this.editor.chain().focus().setImage({ src, alt }).run();
  // }
  setTextAlign(align: TextAlign) {
    return this.editor.chain().focus().setTextAlign(align).run();
  }
  undo() {
    return this.editor.chain().focus().undo().run();
  }
  redo() {
    return this.editor.chain().focus().redo().run();
  }
  selectAll() {
    return this.editor.chain().focus().selectAll().run();
  }
  clearContent() {
    return this.editor.chain().focus().clearContent().run();
  }
  focus() {
    return this.editor.chain().focus().run();
  }
  getEditor(): Editor {
    return this.editor;
  }
}

let globalEditorActions: EditorActions | null = null;

export const getEditorActions = (editor?: Editor): EditorActions | null => {
  if (
    editor &&
    (!globalEditorActions || globalEditorActions.getEditor() !== editor)
  ) {
    globalEditorActions = EditorActions.create(editor);
  }
  return globalEditorActions;
};
