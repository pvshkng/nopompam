//Turnaround summarization
//explore semantic routing layer before sending prompt to BE
//add rag reference component under msgArea

import { ChatProvider } from "@/components/Chat/ChatContext/ChatContext";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import * as c from "@/components/Chat/_index";
import { queryChat } from "@/lib/actions/mongodb/_index";
import { querySuggestions, queryTemplates } from "@/lib/prompts/_index";

export default async function Chat({
  params,
}: {
  params: Promise<{ _id: string }>;
}) {
  const session = await auth();
  !session && redirect("/");
  const { name, email, image } = session?.user!;
  const _id = (await params)._id!;
  let chats;
  _id && email ? (chats = await queryChat(_id, email)) : (chats = []);
  !chats && redirect("/");
  //const templates = await queryTemplates();
  //const suggestions = await querySuggestions();

  if (session) {
    return (
      <>
        <ChatProvider initialMessages={chats} _id={_id} email={email}>
          <div className="relative flex h-full w-full flex-1 flex-col overflow-hidden">
            {" "}
            {/* relative flex h-full w-full flex-1 flex-col overflow-hidden */}
            {/* <c.NavBar name={name} image={image} _id={_id} email={email} /> */}
            <c.ChatBackground />
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
