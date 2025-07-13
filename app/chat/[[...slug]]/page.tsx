/* eslint-disable @typescript-eslint/ban-ts-comment */

import { ChatProvider } from "@/components/chat/ChatContext/ChatContext";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Wrapper } from "@/components/chat/wrapper";
import { createChat, getChat } from "@/lib/ai/chat-store";
import { getThreads, getThread } from "@/lib/mongo/chat-store";
import { getArtifacts } from "@/lib/mongo/artifact-store";
import { cn } from "@/lib/utils";
import { GridBackground } from "@/components/background-grid";
import { generateId } from "ai";

export default async function Chat({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const session = await auth();
  const { name, email, image } = session?.user!;

  if (!session) {
    redirect("/");
  }

  let initialThreads: any = [];
  if (email) {
    initialThreads = await getThreads(email!);
  }
  let messages: any[] = [];
  let artifacts: any[] = [];
  const { slug } = await params;
  let _id = slug?.[0] || undefined;

  if (_id) {
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
