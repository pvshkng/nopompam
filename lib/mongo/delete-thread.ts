"use server";

import { ObjectId } from "mongodb";
import * as mg from "./config";
export default async function deleteTopic(_id: string, email: string) {
  const query = { _id: new ObjectId(_id), user: email };
  const collection = await mg.getCollection("kchat", "chatlog");
  try {
    const result = await collection.deleteOne(query);
    return result.acknowledged;
  } catch (error) {
    console.error(error);
  }
}
