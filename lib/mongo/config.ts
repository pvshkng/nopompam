import { MongoClient, Db, Collection, ServerApiVersion } from "mongodb";

export const uri: string | undefined = process.env.MONGODB_URI;

let client: MongoClient | null = null;
let threadsCollection: Collection | null = null;
let artifactsCollection: Collection | null = null;

export const DB = "chat";
export const THREAD_COLLECTION = "thread";
export const ARTIFACT_COLLECTION = "artifact";

export const mongoDbClient = new MongoClient(uri!, {
  socketTimeoutMS: 60000,
  connectTimeoutMS: 60000,
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
});

export async function getThreadsCollection(): Promise<Collection> {

  const database: Db = mongoDbClient.db(DB);
  const threadsCollection = database.collection(THREAD_COLLECTION);
  return threadsCollection;
}



export async function closeConnection() {
  mongoDbClient.close();
}

export async function shutdownMongo() {
  console.log("Terminating MongoDB connection");
  await closeConnection();
  console.log("MongoDB connection was terminated");
  process.exit(0);
}
