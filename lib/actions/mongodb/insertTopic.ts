"use server";

import { ObjectId } from "mongodb";
import * as mg from "./config";

type Args = {
  userMessage: string;
  assistantMessage: string;
  aiMsgId: string;
  citation?: any[];
};

export default async function insertTopic(user: string, args: Args) {
  const userChat = {
    _id: new ObjectId(),
    role: "user",
    content: args.userMessage,
  };

  const aiChat = {
    _id: ObjectId.createFromHexString(args.aiMsgId),
    role: "assistant",
    content: args.assistantMessage
  };

  try {
    const collection = await mg.getCollection("chatai", "chatlog");
    const document = {
      _id: new ObjectId(),
      topic: args.userMessage,
      user: user,
      timestamp: new Date(),
      chats: [userChat, aiChat],
    };

    const result = await collection.insertOne(document);
    console.log("Topic inserted: ", result.insertedId);
    const insertedTopicId: string = result.insertedId.toString();
    const responseId: string = aiChat._id.toString();
    //return [insertedTopicId, responseId];
    return insertedTopicId
  } catch (error) {
    console.error(error);
  }
}
