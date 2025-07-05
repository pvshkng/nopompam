import { MongoClient, Db, Collection, ServerApiVersion } from "mongodb";
export const uri: string | undefined = process.env.MONGODB_URI;

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export const DB = "chat";
export const THREAD_COLLECTION = "thread";
export const ARTIFACT_COLLECTION = "artifact";


export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return {
      client: cachedClient,
      db: cachedDb,
    };
  }

  const opts = {
    socketTimeoutMS: 60000,
    connectTimeoutMS: 60000,
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true
    }
  };

  let client = new MongoClient(uri!, opts);
  await client.connect();
  let db = client.db(DB);

  cachedClient = client;
  cachedDb = db;

  return {
    client: cachedClient,
    db: cachedDb,
  };
}