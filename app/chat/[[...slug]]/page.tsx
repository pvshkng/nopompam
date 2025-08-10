/* eslint-disable @typescript-eslint/ban-ts-comment */

// import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Root } from "@/components/chat";
import { createChat, getChat } from "@/lib/ai/chat-store";
import { getThreads, getThread } from "@/lib/mongo/chat-store";
import { getArtifacts } from "@/lib/mongo/artifact-store";
import { cn } from "@/lib/utils";
import { GridBackground } from "@/components/background-grid";
import { generateId } from "ai";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
export default async function Chat({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  let initialThreads: any = [];
  let messages: any[] = [];
  let artifacts: any[] = [];
  let name;
  let email;
  let image;

  const { slug } = await params;
  let _id = slug?.[0] || undefined;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    let { name, email, image } = session!.user!;

    if (email) {
      initialThreads = await getThreads(email);
    }
    if (_id) {
      messages = await getThread(email, _id);
      artifacts = await getArtifacts(_id, email);
      if (messages.length === 0) {
        redirect("/chat");
      }
    }
  }

  if (_id && !session) {
    redirect(`/chat`);
  }

  return (
    <>
      <GridBackground />
      <Root
        initialMessages={messages}
        initialThreads={initialThreads}
        initialArtifacts={artifacts}
        _id={_id || generateId()}
        session={session}
        email={email}
        name={name}
        image={image}
      />
    </>
  );
}
