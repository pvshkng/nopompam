"use server";

import { ObjectId } from "mongodb";
import * as mg from "./config";
import { arrayBuffer } from "stream/consumers";

export default async function queryChat(_id: string, user?: string) {
  let chats: any = [];
  try {
    const collection = await mg.getCollection("kchat", "chatlog");
    let query;
    user
      ? (query = { _id: ObjectId.createFromHexString(_id), user: user })
      : (query = { _id: ObjectId.createFromHexString(_id) });
    const projection = {
      "chats._id": 1,
      "chats.role": 1,
      "chats.content": 1
    };
    const result = await collection.findOne(query, {
      projection: projection,
    });
    chats = result?.chats.map((m: any) => ({
      ...m,
      _id: m._id && m._id.toString ? m._id.toString() : m._id,
    }));
  } catch (error) {
    console.error(error);
    chats = undefined;
  }

  return chats;
}
