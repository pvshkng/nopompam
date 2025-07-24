"use client";

import { memo } from "react";
import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";

import { useChat } from "@ai-sdk/react";
import { createIdGenerator, generateId } from "ai";
import { Dossier } from "@/components/dossier";
import { MobileDossier } from "@/components/dossier/mobile";
import { BottomScrollButton } from "@/components/chat/message-area/scroll-to-bottom";
import { Navigation } from "@/components/chat/navigation";
import { MessageArea } from "@/components/chat/message-area/message-area";
import { UserInput } from "@/components/chat/user-input/UserInput";

import { artifactStreamHandler } from "@/lib/artifacts/handler";
import { handleNewThread } from "@/lib/thread/new-thread-handler";
import { authClient } from "@/lib/auth-client";
import { createAuthClient } from "better-auth/react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { useMediaQuery } from "@/hooks/use-media-query";

// TODO: to rename to ChatRoot
type PureWrapperProps = {
  initialMessages: any[];
  initialThreads: any[];
  initialArtifacts: any[];
  _id: string | undefined;
  session: any;
  email: string | null | undefined;
  name: string | null | undefined;
  image: string | null | undefined;
};

const { useSession } = createAuthClient();

function PureWrapper(props: PureWrapperProps) {
  let {
    initialMessages,
    initialThreads,
    initialArtifacts,
    _id,
    session,
    email,
    name,
    image,
  } = props;
  const params = useParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);
  const [isCurrentBottom, setIsCurrentBottom] = useState(true);
  const [isChatInitiated, setIsChatInitiated] = useState(false);
  const [DossierSwapped, isDossierSwapped] = useState(false);
  const [dossierOpen, setDossierOpen] = useState(false);
  const [streamData, setStreamData] = useState<any[]>([]);
  const [sidebarToggled, setSidebarToggled] = useState(true);
  const [artifacts, setArtifacts] = useState(initialArtifacts);
  const [activeTab, setActiveTab] = useState(null);
  const [model, setModel] = useState("gemini-2.5-pro");
  // to do centralize this type
  type Thread = {
    _id: any;
    user: any;
    title: any;
    timestamp: string;
  };
  const [threads, setThreads] = useState<Thread[]>(initialThreads || []);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const {
    messages,
    isLoading,
    status,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    data,
    setData,
  } = useChat({
    maxSteps: 3,
    id: _id,
    initialMessages: initialMessages,
    sendExtraMessageFields: true,
    generateId: createIdGenerator({
      prefix: "msgc",
      size: 16,
    }),
    body: {
      user: session?.user?.email || undefined,
      model: model,
    },

    onFinish: (messages) => {
      if (!params?.slug!) {
        console.log("Creating new thread with messages: ", messages);
        handleNewThread({
          messages,
          _id,
          email,
          setThreads,
        });
      }
    },

    streamProtocol: "data",
  });

  const sess = authClient.useSession();
  //console.log("Session in Wrapper: ", sess);

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Process each streaming item sequentially
    let updatedArtifacts = artifacts;
    for (const item of data) {
      updatedArtifacts = artifactStreamHandler(item, updatedArtifacts);
    }
    setArtifacts(updatedArtifacts);

    setData([]);
  }, [data, artifacts, setArtifacts]);

  useEffect(() => {
    if (isScrolledToBottom) {
      scrollToBottom();
    }
  }, [messages, isScrolledToBottom]);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop! = containerRef.current.scrollHeight!;
    }
  };

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const isBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px threshold
      setIsScrolledToBottom(isBottom);
      setIsCurrentBottom(scrollTop >= 0);
    }
  };

  return (
    <>
      <div className="flex flex-col h-full w-full bg-transparent">
        <Navigation
          _id={_id}
          session={session}
          email={email}
          sidebarToggled={sidebarToggled}
          setSidebarToggled={setSidebarToggled}
          threads={threads}
          setThreads={setThreads}
        />
        <div className="flex flex-row size-full overflow-hidden">
          <div
            className={cn(
              "relative flex h-full w-full min-w-[400px]",
              "flex-1 flex-col overflow-hidden",
              "shadow-[0_3px_10px_rgb(0,0,0,0.2)]"
            )}
          >
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel className="relative flex flex-col h-full w-full overflow-y-auto overflow-x-hidden min-w-[350px]">
                <main className="relative flex-1 flex flex-col-reverse h-full w-full overflow-y-auto overflow-x-hidden">
                  <div
                    ref={containerRef}
                    onScroll={handleScroll}
                    id="scrollArea"
                    className="relative flex flex-col-reverse items-center h-full w-full overflow-y-scroll overflow-x-hidden scroll-smooth"
                  >
                    <div
                      id="wrapper"
                      className="flex flex-col-reverse mx-auto px-6 bg-transparent h-full w-full max-w-[800px] text-black"
                    >
                      {!isChatInitiated && messages.length === 0 ? (
                        <></>
                      ) : (
                        <>
                          <MessageArea
                            status={status}
                            name={name!}
                            image={image!}
                            messages={messages}
                            isLoading={isLoading}
                            artifacts={artifacts}
                            setArtifacts={setArtifacts}
                            dossierOpen={dossierOpen}
                            // @ts-ignore
                            setDossierOpen={setDossierOpen}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                          />
                        </>
                      )}
                    </div>
                  </div>
                  <BottomScrollButton
                    scrollToBottom={scrollToBottom}
                    isCurrentBottom={isCurrentBottom}
                  />
                </main>

                <UserInput
                  messages={messages}
                  status={status}
                  isLoading={isLoading}
                  input={input}
                  setInput={setInput}
                  handleInputChange={handleInputChange}
                  handleSubmit={handleSubmit}
                  dossierOpen={dossierOpen}
                  setDossierOpen={setDossierOpen}
                  model={model}
                  setModel={setModel}
                />
              </ResizablePanel>

              {isDesktop ? (
                dossierOpen && (
                  <>
                    <ResizableHandle
                      /* hidden */
                      className={cn(
                        //!dossierOpen && "hidden",
                        "relative overflow-visible",
                        "max-md:hidden"
                      )}
                      withHandle={false}
                      onClick={() => {}}
                    />
                    <ResizablePanel
                      className={cn(
                        !dossierOpen && "hidden",
                        "flex flex-col h-full w-full min-w-[300px]",
                        "max-md:hidden",
                        "bg-stone-50"
                      )}
                    >
                      <Dossier
                        dossierOpen={dossierOpen}
                        setDossierOpen={setDossierOpen}
                        artifacts={artifacts}
                        setArtifacts={setArtifacts}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                      />
                    </ResizablePanel>
                  </>
                )
              ) : (
                <MobileDossier
                  dossierOpen={dossierOpen}
                  setDossierOpen={setDossierOpen}
                  artifacts={artifacts}
                  setArtifacts={setArtifacts}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              )}
            </ResizablePanelGroup>
          </div>
        </div>
      </div>
    </>
  );
}

export const Wrapper = memo(PureWrapper);
