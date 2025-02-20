/* eslint-disable @typescript-eslint/ban-ts-comment */

import { ChatProvider } from "@/components/Chat/ChatContext/ChatContext";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import * as c from "@/components/Chat/_index";
import { queryChat } from "@/lib/actions/mongodb/_index";
import { createChat, getChat } from "@/lib/ai/chat-store";
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

  let messages = [];
  let _id = (await searchParams)._id!;
  console.log("_id: ", _id);
  if (_id) {
    messages = await getChat(_id);
    messages.length === 0 && redirect("/");
  } else {
    // to move to client once first chat is created
    _id = await createChat(email!);
    // redirect(`/chat?_id=${_id}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  //_id && email ? (messages = await queryChat(_id, email)) : (messages = []);
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  //!messages && redirect("/");

  //const templates = await queryTemplates();
  //const suggestions = await querySuggestions();

  if (session) {
    return (
      <>
        {/* @ts-ignore */}
        <ChatProvider initialMessages={messages} _id={_id} email={email}>
          <div className="relative flex h-full w-full flex-1 flex-col overflow-hidden">
            {/* relative flex h-full w-full flex-1 flex-col overflow-hidden */}
            {/* <c.NavBar name={name} image={image} _id={_id} email={email} /> */}
            <c.GradientBackground />
            <c.ChatWrapper
              initialMessages={messages}
              _id={_id}
              email={email}
              name={name}
              image={image}
            />
          </div>
        </ChatProvider>
      </>
    );
  } else {
    redirect("/");
  }
}
