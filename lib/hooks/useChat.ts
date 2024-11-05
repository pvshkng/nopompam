import * as mg from "@/lib/actions/mongodb/_index";
import * as c from "@/lib/hooks/useChatCallback";
import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { generateObjectId } from "@/lib/utils";

type Message = {
  role: "system" | "user" | "assistant";
  content: string;
  loading?: boolean;
  _id: string;
};

export function useChat(
  initialMessages: Message[],
  _id: string | null,
  email: string
) {
  const router = useRouter();
  const [userInput, setUserInput] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages || []);
  const [usecase, setUsecase] = useState("auto");
  const [lastInvocation, setLastInvocation] = useState({ p: "", uc: "auto" });
  const lastMsgRef = useRef("");
  const abortControllerRef = useRef<AbortController | null>(null);

  const getStreamingResponse = useCallback(c.getStreamingResponse, []);
  const getMemory = useCallback(c.getMemory, []);

  const handleKeypress = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [userInput, isLoading]
  );

  const adjustUserInput = useCallback(() => {
    const textarea = document.getElementById(
      "userInput"
    ) as HTMLTextAreaElement;
    if (textarea) textarea.style.height = "auto";
  }, []);

  const handleSend = useCallback(
    async (template?: string, templateUsecase?: string, isRetry = false) => {
      const tempText = template || userInput;
      const uc = templateUsecase || usecase;
      if (!tempText || isLoading) return;
      adjustUserInput();
      setUserInput("");
      setLoading(true);
      !isRetry && insertBubble("user", tempText, false);

      handleWait("start"); // insert three dots

      let context = getMemory(messages);
      let response = await getStreamingResponse(context, tempText, uc);

      // Placeholder for streaming stop button
      // abortControllerRef.current.signal

      handleWait("stop"); // remove three dots

      let aiMsgId = await streamingHandler(
        "assistant",
        //@ts-nocheck
        response,
        isRetry ? messages[messages.length - 1]._id : undefined
      );

      // abortControllerRef.current = new AbortController();
      
      try {
        if (!response) {
          throw new Error("Failed to get streaming response");
        }
      } catch (error) {
        insertBubble(
          "assistant",
          "An error occurred. Please try again.",
          false
        );
      } finally {
        if (!_id) {
          const args = {
            userMessage: tempText,
            assistantMessage: lastMsgRef.current,
            aiMsgId: aiMsgId,
          };

          const insertedTopicId = await mg.insertTopic(email, args);
          router.push(`/chat?_id=${insertedTopicId}`);
        } else {
          let humanMsg = { role: "user", content: tempText };
          let assistantMsg = {
            role: "assistant",
            content: lastMsgRef.current,
            aiMsgId: aiMsgId,
          };
          if (isRetry) {
            let recentId = messages[messages.length - 1]._id;
            await mg.updateChat(_id, recentId, assistantMsg);
          } else {
            await mg.insertChat(_id, humanMsg);
            await mg.insertChat(_id, assistantMsg);
          }
        }

        setLastInvocation({ p: tempText, uc: usecase });
        setLoading(false);
        c.scrollToBottom();
        //abortControllerRef.current = null;
      }
    },
    [userInput, isLoading, messages, usecase, email, _id]
  );

  const streamingHandler = useCallback(
    async (
      role: "user" | "assistant",
      response: Response | string,
      recentId?: string
    ) => {

      const msgId = recentId ? recentId : generateObjectId();

      // @ts-ignore
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          content: "",
          role,
          _id: msgId,
        },
      ]);

      let incomingMessage = "";

      try {
        while (true) {
          const { value, done } = await reader.read();

          if (value) {
            const chunk = decoder.decode(value, { stream: true });

            for (const token of chunk) {
              incomingMessage += token;
              lastMsgRef.current = incomingMessage;

              setMessages((messages) => {
                const updatedMessages = [...messages];
                const lastMessage = updatedMessages[updatedMessages.length - 1];
                lastMessage.content = incomingMessage;
                return updatedMessages;
              });

              // Per token streaming animation
              // Uncomment to enable
              // await new Promise((resolve) => setTimeout(resolve, 0));
            }
          }

          if (done) {
            setMessages((messages) => {
              const updatedMessages = [...messages];
              const lastMessage = updatedMessages[updatedMessages.length - 1];
              lastMessage.content = incomingMessage;
              return updatedMessages;
            });

            break;
          }
        }
      } catch (error) {
        console.error("Error in streamingHandler:", error);
      }

      return msgId;
    },
    [setMessages]
  );

  
  const insertBubble = useCallback(
    (
      role: "user" | "assistant",
      text: string,
      isLoading: boolean,
      responseId?: string
    ) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          content: text,
          role: role,
          loading: isLoading,
          _id: responseId || generateObjectId(),
        },
      ]);
      c.scrollToBottom();
    },
    []
  );

  const handleRetry = useCallback(async () => {
    if (!_id) return;

    let recentPrompt =
      messages[messages.length - 2]?.content || lastInvocation.p;
    let recentUsecase = lastInvocation.uc || usecase;
    let recentResponseId = messages[messages.length - 1]?._id;

    if (!recentPrompt || !recentResponseId) {
      console.error("Error: missing prompt or response ID");
      return;
    }
    setMessages((prev) => prev.slice(0, -1));
    try {
      handleSend(recentPrompt, recentUsecase, true);
    } catch (error) {
      console.error("Error in handleRetry:", error);
    }
  }, [handleSend, messages, usecase, lastInvocation, _id]);


  // Placeholder for handling stop streaming, uncomment if necessary
  //
  // const stopGenerating = useCallback(() => {
  //    if (abortControllerRef.current) {
  //     abortControllerRef.current.abort();
  //     setLoading(false);
  //   }
  // }, [messages, setMessages]);


  const handleWait = useCallback(
    (ops: string) => {
      if (ops === "start") {
        setTimeout(() => {
          setMessages((prevMessages) => {
            // Check if there's already a loading message
            const hasLoading = prevMessages.some((msg) => msg.loading);
            const isReplied = prevMessages[prevMessages.length - 1].role === "assistant";

            if (!hasLoading && !isReplied) {
              return [
                ...prevMessages,
                {
                  content: "",
                  role: "assistant",
                  _id: generateObjectId(),
                  loading: true,
                },
              ];
            }

            return prevMessages;
          });
        }, 300);
      } else if (ops === "stop") {
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => !msg.loading)
        );
      }
    },
    [setMessages]
  );

  return {
    userInput,
    setUserInput,
    isLoading,
    setLoading,
    messages,
    setMessages,
    handleKeypress,
    handleSend,
    usecase,
    setUsecase,
    handleRetry,
    _id,
    email,
  };
}
