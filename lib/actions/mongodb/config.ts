import { MongoClient } from "mongodb";

export const uri: string | undefined = process.env.MONGODB_URI!;

let client: MongoClient | null = null;

export async function getClient() {
  const uri = process.env.MONGODB_URI!;
  if (!client && uri) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client;
}

export async function getCollection(db: string, col: string) {
  const client = await getClient() || ({} as MongoClient);
  return client.db(db).collection(col) ;
}

export async function closeConnection() {
  if (client) {
    await client.close();
    client = null;
  }
}

export async function shutdownMongo() {
  console.log("Terminating MongoDB connection");
  await closeConnection();
  console.log("MongoDB connection was terminated");
  process.exit(0);
}
