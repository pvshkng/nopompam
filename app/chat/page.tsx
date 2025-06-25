/* eslint-disable @typescript-eslint/ban-ts-comment */

import { ChatProvider } from "@/components/Chat/ChatContext/ChatContext";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Wrapper } from "@/components/Chat/wrapper";
import { createChat, getChat } from "@/lib/ai/chat-store";
import { getThreads, getThread } from "@/lib/mongo/chat-store";
import { getArtifacts } from "@/lib/mongo/artifact-store";
import { cn } from "@/lib/utils";
import { GridBackground } from "@/components/background-grid";
import { generateId } from "ai";
// import { querySuggestions, queryTemplates } from "@/lib/prompts/_index";

export default async function Chat({
  params,
  searchParams,
}: {
  params: Promise<{ _id: string }>;
  searchParams: { _id?: string };
}) {
  const session = await auth();
  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
  const { name, email, image } = session?.user!;

  let initialThreads: any = [];
  if (email) {
    initialThreads = await getThreads(email!);
  }
  let messages: any[] = [];
  let artifacts: any[] = [];
  let _id = (await searchParams)._id!;
  if (_id) {
    //messages = await getChat(email!, _id!);
    messages = await getThread(email!, _id!);
    messages.length === 0 && redirect("/");
    artifacts = await getArtifacts(_id!, email!);
    console.log("artifacts", artifacts);
  } else {
    _id = generateId(24);
  }

  if (session) {
    return (
      <>
        {/* @ts-ignore */}
        <ChatProvider initialMessages={messages} _id={_id} email={email}>
          {/* relative flex h-full w-full flex-1 flex-col overflow-hidden */}
          {/* <c.NavBar name={name} image={image} _id={_id} email={email} /> */}
          {/* <c.GradientBackground /> */}
          <GridBackground />
          <Wrapper
            initialMessages={messages}
            initialThreads={initialThreads}
            initialArtifacts={artifacts}
            _id={_id}
            email={email}
            name={name}
            image={image}
          />
        </ChatProvider>
      </>
    );
  } else {
    redirect("/");
  }
}
