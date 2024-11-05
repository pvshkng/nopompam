"use server";

import { ObjectId } from "mongodb";
import * as mg from "./config";

type Message = {
  role: "assistant" | "user";
  content: string;
  aiMsgId?: string
};

export default async function insertChat(id: string, m: Message | any) {
  try {
    const collection = await mg.getCollection("kchat", "chatlog");
    const _id = ObjectId.createFromHexString(id);

    //TO DO: format data from message arg
    const chat: any = {
      _id: m.role === "assistant" ? ObjectId.createFromHexString(m.aiMsgId) : new ObjectId(),
      role: m.role,
      content: m.content
    };
    const result = await collection.updateOne(
      { _id: _id },
      { $push: { chats: chat } }
    );
    console.log("Chat inserted: ", result.modifiedCount);
  } catch (error) {
    console.error(error);
  }
}
