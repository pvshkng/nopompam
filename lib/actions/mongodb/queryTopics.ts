"use server";
import * as mg from "./config";

export default async function queryTopics(user: string | null | undefined) {
  let topics: any[] = [];
  let query = { user: user };

  try {
    const collection = await mg.getCollection("kchat", "chatlog");
    collection.createIndex({ timestamp: -1 });
    const result = await collection
      .find(query, {
        projection: {
          _id: 1,
          topic: 1,
          timestamp: 1,
        },
      })
      .sort({ timestamp: -1 })
      .toArray();

    topics = result.map((doc) => ({
      _id: doc._id.toString(),
      topic: doc.topic,
      timestamp: doc.timestamp.toString(),
    }));
  } catch (error) {
    console.error(error);
  }

  return topics;
}
