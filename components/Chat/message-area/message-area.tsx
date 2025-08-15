"use client";
import React, { Dispatch, SetStateAction } from "react";
import { cn } from "@/lib/utils";
import "@/styles/message-area.css";
import "@/styles/typewriter.css";
import "@/styles/streaming-effect.css";
// import "@/lib/LaTeX/katex.min.css";
import { UIMessage } from "ai";
import { MessageBlock } from "./message-block";
import { memo } from "react";
import { MessageSkeleton } from "./message-loading-skeleton";
import { AnimatePresence, motion } from "framer-motion";
type MessageAreaProps = {
  status: string;
  name: string;
  image: string;
  messages: UIMessage[];
  artifacts: any[];
  setArtifacts: Dispatch<SetStateAction<any[]>>;
  dossierOpen: boolean;
  setDossierOpen: boolean;
  activeTab: any;
  setActiveTab: any;
};

export default function PureMessageArea(props: MessageAreaProps) {
  const { status, messages } = props;

  return (
    <div id="msgArea" className={cn("text-sm py-7 mb-auto")}>
      {messages.map((m, i) => (
        <div
          key={m.id}
          className={cn(
            "whitespace-normal break-words text-sm flex w-full",
            m.role == "user" ? "justify-end" : "justify-center"
          )}
        >
          <MessageBlock
            status={status}
            m={m}
            isLast={i === messages.length - 1}
          />
        </div>
      ))}

      <AnimatePresence>
        {status === "submitted" && (
          <motion.div
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 0 }}
            transition={{ duration: 0.1 }}
          >
            <MessageSkeleton />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export const MessageArea = memo(PureMessageArea);
