"use client";

import { cn } from "@/lib/utils";
import { memo, useCallback, useMemo, useState, useRef } from "react";

import { ArrowUp, CircleStop, Paperclip, Loader2 } from "lucide-react";
import { UserInputOptions } from "./user-input-options";

import { MessageTemplate } from "@/components/chat-message-area/message-template";
import { useAuthDialogStore } from "@/lib/stores/auth-dialog-store";
import { useShallow } from "zustand/react/shallow";
import { useDossierStore } from "@/lib/stores/dossier-store";
import { useInputStore } from "@/lib/stores/input-store";

import { FilePreview } from "./attachment-preview";

import { uploadMultipleFiles } from "@/lib/actions/blob";
import { toast } from "sonner";

const PureUserInput = memo(function PureUserInput(props: any) {
  const { stop, session, messages, status, handleSubmit, model, setModel } =
    props;
  const { dossierOpen, setDossierOpen } = useDossierStore();

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);

  const { input, setInput, files, addFiles, removeFile, clearFiles } =
    useInputStore();
  const { openAuthDialog } = useAuthDialogStore(
    useShallow((state) => ({
      openAuthDialog: state.open,
    }))
  );

  // Debounced height adjustment
  const adjustHeight = useCallback((element: HTMLTextAreaElement) => {
    requestAnimationFrame(() => {
      element.style.height = "auto";
      element.style.height = `${Math.min(element.scrollHeight, 150)}px`;
    });
  }, []);

  // Memoize handlers
  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
      adjustHeight(e.target);
    },
    [setInput, adjustHeight]
  );

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files;
      if (!selectedFiles || selectedFiles.length === 0) return;

      setIsUploading(true);
      try {
        const uploadedFiles = await uploadMultipleFiles(selectedFiles);
        addFiles(uploadedFiles);
        toast.success(`${uploadedFiles.length} file(s) attached`);
      } catch (error) {
        console.error("File upload error:", error);
        toast.error("Failed to upload files");
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [addFiles]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (session) {
          handleSubmit(e);
          if (inputRef.current) {
            inputRef.current.style.height = "auto";
          }
        } else {
          openAuthDialog();
        }
      }
    },
    [session, handleSubmit, openAuthDialog]
  );

  const handleButtonClick = useCallback(
    (e: React.MouseEvent) => {
      if (status !== "ready") {
        stop();
      }
      if (inputRef.current) {
        inputRef.current.style.height = "auto";
      }
      if (session) {
        handleSubmit(e);
      } else {
        openAuthDialog();
      }
    },
    [status, stop, session, handleSubmit, openAuthDialog]
  );

  const handleAttachClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="w-full flex items-center justify-center my-auto">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.pdf,.doc,.docx,.txt,.csv,.xlsx,.xls"
        onChange={handleFileSelect}
        className="hidden"
      />
      <div
        className={cn(
          "flex flex-col items-center justify-center",
          "w-full px-auto px-3 mb-1 bg-transparent"
        )}
      >
        {messages.length === 0 && status === "ready" && <MessageTemplate />}

        <div
          className={cn(
            "relative",
            "border border-stone-700 text-black",
            "flex flex-row mx-auto w-full max-w-[800px]",
            "bg-stone-50"
          )}
        >
          <div className="flex flex-col w-full">
            <FilePreview files={files} onRemove={removeFile} />
            <textarea
              ref={inputRef}
              autoFocus
              autoComplete="off"
              rows={1}
              placeholder="Ask me anything..."
              className={cn(
                "text-sm break-all outline-none border-none bg-transparent",
                "mx-4 my-3 w-full h-auto resize-none overflow-auto",
                "placeholder:truncate"
              )}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
            />
          </div>

          <button
            type="button"
            onClick={handleAttachClick}
            disabled={isUploading || status !== "ready"}
            className="text-stone-700 mx-1 flex items-center justify-center ml-2 my-auto hover:text-stone-500 rounded p-2 transition-colors disabled:opacity-50"
            title="Attach files"
          >
            {isUploading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Paperclip className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={handleButtonClick}
            disabled={isUploading || status !== "ready"}
            className="flex items-center justify-center bg-stone-700 p-1 px-2"
          >
            {status === "ready" ? (
              <ArrowUp size={24} color="white" />
            ) : (
              <CircleStop size={24} color="white" />
            )}
          </button>
        </div>

        <UserInputOptions
          dossierOpen={dossierOpen}
          setDossierOpen={setDossierOpen}
          model={model}
          setModel={setModel}
        />
      </div>
    </div>
  );
});

export const UserInput = PureUserInput;
