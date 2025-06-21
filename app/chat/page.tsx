/* eslint-disable @typescript-eslint/ban-ts-comment */

import { ChatProvider } from "@/components/Chat/ChatContext/ChatContext";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import * as c from "@/components/Chat/_index";
import { LeftSidebar } from "@/components/left-sidebar/";
import { queryChat } from "@/lib/actions/mongodb/_index";
import { createChat, getChat, getChatsByUser } from "@/lib/ai/chat-store";
import { cn } from "@/lib/utils";
// import { querySuggestions, queryTemplates } from "@/lib/prompts/_index";

export default async function Chat({
  params,
  searchParams,
}: {
  params: Promise<{ _id: string }>;
}) {
  const session = await auth();
  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
  const { name, email, image } = session?.user!;
  //const threads = await getChatsByUser(email!);

  let messages = [];
  let _id = (await searchParams)._id!;
  if (_id) {
    messages = await getChat(email, _id);
    messages.length === 0 && redirect("/");
  } else {
    _id = await createChat(email!);
  }

  if (session) {
    return (
      <>
        {/* @ts-ignore */}
        <ChatProvider initialMessages={messages} _id={_id} email={email}>
          
            
              {/* relative flex h-full w-full flex-1 flex-col overflow-hidden */}
              {/* <c.NavBar name={name} image={image} _id={_id} email={email} /> */}
              {/* <c.GradientBackground /> */}

              <c.Wrapper
                initialMessages={messages}
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
