"use client";

import { useEditPost } from "../model/useEditPost";
import CreatePostForm from "../ui/CreatePostForm";

export default function CreatePostFormContainer() {
  const {
    setContent,
    setTitle,
    postData,
    updateDraft,
    isSaving,
    lastSaved,
    saveError,
    isLoading,
    loadError,
    isAuthenticated,
    authLoading,
  } = useEditPost();

  const handleManualSave = async (): Promise<boolean> => {
    return await updateDraft();
  };

  const handleClearDraft = () => {
    setTitle("");
    setContent("");
  };

  return (
    <CreatePostForm
      title={postData.title}
      content={postData.content}
      isSaving={isSaving}
      isLoading={isLoading}
      authLoading={authLoading}
      isAuthenticated={isAuthenticated}
      lastSaved={lastSaved || undefined}
      saveError={saveError || undefined}
      loadError={loadError || undefined}
      onTitleChange={setTitle}
      onContentChange={setContent}
      onManualSave={handleManualSave}
      onClearDraft={handleClearDraft}
    />
  );
}
