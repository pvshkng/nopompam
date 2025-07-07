import { MongoClient, Db, Collection, ServerApiVersion } from "mongodb";
export const uri: string | undefined = process.env.MONGODB_URI;

let globalWithMongo = global as typeof globalThis & {
  _mongoClient?: MongoClient;
  _mongoDb?: Db;
};

export const DB = "chat";
export const THREAD_COLLECTION = "thread";
export const ARTIFACT_COLLECTION = "artifact";


export async function connectToDatabase() {
  if (!uri) throw new Error("MONGODB_URI not set");

  if (!globalWithMongo._mongoClient || !globalWithMongo._mongoDb) {
    const opts = {
      socketTimeoutMS: 60000,
      connectTimeoutMS: 60000,
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
      }
    };

    const client = new MongoClient(uri, opts);
    await client.connect();
    const db = client.db(DB);

    globalWithMongo._mongoClient = client;
    globalWithMongo._mongoDb = db;
  }

  return {
    client: globalWithMongo._mongoClient!,
    db: globalWithMongo._mongoDb!,
  };
}