import { Collection, Db, MongoClient } from "mongodb";

interface IFaucet {
  _id: any;
  address: string;
  tweetID: string;
  transaction?: string;
  replyID?: string;
}

let cachedClient: MongoClient;
let cachedDb: Db;
let cachedFaucet: Collection<IFaucet>;

export async function connectToDatabase() {
  if (cachedClient && cachedDb && cachedFaucet) {
    return { client: cachedClient, db: cachedDb, faucet: cachedFaucet };
  }

  const client = await MongoClient.connect(
    `mongodb+srv://admin:${process.env.PASSWORD}@cluster0.67hs5.mongodb.net`,
    {
      useUnifiedTopology: true,
    }
  );

  const db = client.db("cache");
  const faucet = db.collection<IFaucet>("faucet");

  cachedClient = client;
  cachedDb = db;
  cachedFaucet = faucet;

  return { client, db, faucet };
}
