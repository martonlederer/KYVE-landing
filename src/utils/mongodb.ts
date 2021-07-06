import { MongoClient } from "mongodb";

let cachedClient;
let cachedDb;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(
    `mongodb+srv://admin:${process.env.PASSWORD}@cluster0.67hs5.mongodb.net`,
    {
      useUnifiedTopology: true,
    }
  );

  const db = client.db("cache");

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}
