import { connectToDatabase } from "../../utils/mongodb";

export default async (req, res) => {
  const { db } = await connectToDatabase();

  const contracts = await db.collection("contracts").find().toArray();

  let pools: { [id: string]: any } = {};
  for (const contract of contracts) {
    pools[contract._id] = contract.state;
  }

  res.json(pools);
};
