import { NextRequest } from "next/server";
import * as prmpt from "@langchain/core/prompts";
import * as msg from "@langchain/core/messages";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { PassThrough } from "stream";
import { CallbackHandler } from "langfuse-langchain";
import { generateObjectId } from "@/lib/utils";

export async function POST(request: NextRequest) {
  const traceId = generateObjectId();
  const sessionId = "test_session_1236"; //generateObjectId();
  const userId = "test_user@gmail.com";
  const langfuseHandler = new CallbackHandler({
    baseUrl: process.env.LANGFUSE_HOST,
    publicKey: process.env.LANGFUSE_PUBLIC_KEY,
    secretKey: process.env.LANGFUSE_SECRET_KEY,
    userId: userId,
    sessionId: sessionId,
    release: "test_release",
    enabled: true,
  });

  const passThrough = new PassThrough();
  const model = "gemini-1.5-flash";
  const systemPrompt = "";
  const { context, question, usecase } = await request.json();

  const llm = new ChatGoogleGenerativeAI({
    verbose: false,
    streaming: true,
    apiKey: process.env.GOOGLE_API_KEY,
    modelName: model,
    model: model,
    maxOutputTokens: 2048,
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
    ],
  });

  const conversation = prmpt.ChatPromptTemplate.fromMessages([
    //new msg.SystemMessage(systemPrompt),
    { role: "system", content: systemPrompt },
    new prmpt.MessagesPlaceholder("messages"),
  ]);

  const memory = Array.isArray(context)
    ? context
        .map((item) => {
          if (item.role === "user") {
            //return new msg.HumanMessage(item.content);
            return { role: "human", content: item.content };
          } else if (item.role === "assistant") {
            //return new msg.AIMessage(item.content);
            return { role: "assistant", content: item.content };
          }
          return null;
        })
        .filter(Boolean)
    : [];

  console.log("memory = ", memory);

  const chain = conversation.pipe(llm);
  chain.invoke(
    {
      messages: [...memory, { role: "human", content: question }],
    },
    {
      runId: traceId,
      callbacks: [
        langfuseHandler,
        {
          handleLLMNewToken(token) {
            passThrough.write(token);
          },
          async handleLLMEnd(output) {
            passThrough.end();
            /* const generation = output.generations[0][0];
              const tool_calls = generation.message?.tool_calls || [];
              if (tool_calls.length > 0) {
                await handleToolUsage(
                  llm!,
                  tool_calls,
                  passThrough,
                  question,
                  memory
                );
              } else {
                passThrough.end();
              } */
          },
          handleLLMError(error) {
            console.error("LLM Error:", error);
            passThrough.write("ขออภัย มีบางอย่างผิดพลาด กรุณาลองหใหม่อีกครั้ง");
            passThrough.end();
          },
        },
      ],
    }
  );

  const stream = new ReadableStream({
    start(controller) {
      passThrough.on("data", (chunk) => {
        controller.enqueue(chunk);
        //controller.desiredSize;
      });
      passThrough.on("end", () => controller.close());
      passThrough.on("error", (err) => controller.error(err));
    },
  });

  // @ts-expect-error
  return new Response(stream, {
    headers: {
      Connection: "keep-alive",
      "Content-Encoding": "none",
      "Cache-Control": "no-cache, no-transform",
      "Content-Type": "text/plain",
      "Transfer-Encoding": "chunked",
    },
  });
}
