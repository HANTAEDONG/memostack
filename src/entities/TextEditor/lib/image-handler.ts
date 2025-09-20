import { Editor } from "@tiptap/react";

/**
 * 파일을 Base64 문자열로 변환하는 유틸리티 함수
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * 이미지 파일인지 확인하는 함수
 */
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith("image/");
};

/**
 * 이미지 파일들을 필터링하는 함수
 */
export const filterImageFiles = (files: FileList): File[] => {
  return Array.from(files).filter(isImageFile);
};

/**
 * 에디터에 이미지 텍스트를 삽입하는 함수
 */
export const insertImageText = (editor: Editor, fileName: string): void => {
  editor.chain().focus().insertContent(`\n[이미지: ${fileName}]\n`).run();
};

/**
 * 이미지 파일을 에디터에 삽입하는 함수
 */
export const insertImageToEditor = async (
  editor: Editor,
  file: File
): Promise<void> => {
  try {
    // 현재는 텍스트로 삽입하지만, 나중에 실제 이미지로 변경 가능
    // const base64 = await fileToBase64(file);
    insertImageText(editor, file.name);
  } catch (error) {
    console.error("이미지 업로드 실패:", error);
    throw error;
  }
};

/**
 * 드래그 앤 드롭 이벤트에서 이미지 파일들을 처리하는 함수
 */
export const handleImageDrop = async (
  editor: Editor,
  files: File[]
): Promise<void> => {
  const imageFiles = files.filter(isImageFile);

  if (imageFiles.length === 0) return;

  // 각 이미지 파일을 순차적으로 처리
  for (const file of imageFiles) {
    await insertImageToEditor(editor, file);
  }
};
