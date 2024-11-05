"use server";

import { ObjectId } from "mongodb";
import * as mg from "./config";

type Message = {
  role: "assistant" | "user";
  content: string;
};

export default async function updateChat(
  id: string,
  chatId: string,
  m: Message | any
) {
  try {
    const collection = await mg.getCollection("kchat", "chatlog");
    const _id = ObjectId.createFromHexString(id);
    const chatObjectId = ObjectId.createFromHexString(chatId);

    const updatedChat: any = {
      _id: chatObjectId,
      role: m.role,
      content: m.content,
    };

    const result = await collection.updateOne(
      { _id: _id },
      { $set: { "chats.$[elem]": updatedChat } },
      {
        arrayFilters: [{ "elem._id": chatObjectId }],
      }
    );

    console.log("Chat updated: ", result.modifiedCount);
    return chatObjectId.toString();
  } catch (error) {
    console.error(error);
  }
}
