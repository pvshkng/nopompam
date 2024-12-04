/* eslint-disable @typescript-eslint/ban-ts-comment */

import { ChatProvider } from "@/components/Chat/ChatContext/ChatContext";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import * as c from "@/components/Chat/_index";
import { queryChat } from "@/lib/actions/mongodb/_index";
// import { querySuggestions, queryTemplates } from "@/lib/prompts/_index";

export default async function Chat({
  params,
}: {
  params: Promise<{ _id: string }>;
}) {
  const session = await auth();
  if (!session) {
    redirect("/");
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
  const { name, email, image } = session?.user!;
  const _id = (await params)._id!;
  let chats;
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  _id && email ? (chats = await queryChat(_id, email)) : (chats = []);
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  !chats && redirect("/");

  //const templates = await queryTemplates();
  //const suggestions = await querySuggestions();

  if (session) {
    return (
      <>
        {/* @ts-ignore */}
        <ChatProvider initialMessages={chats} _id={_id} email={email}>
          <div className="relative flex h-full w-full flex-1 flex-col overflow-hidden">
            {/* relative flex h-full w-full flex-1 flex-col overflow-hidden */}
            {/* <c.NavBar name={name} image={image} _id={_id} email={email} /> */}
            <c.GradientBackground />
            <c.ChatWrapper name={name} image={image} />
          </div>
          {/* <GenieSpacesPopup /> */}
        </ChatProvider>
      </>
    );
  } else {
    redirect("/");
  }
}
