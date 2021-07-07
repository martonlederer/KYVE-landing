import { connectToDatabase } from "../../utils/mongodb";

export default async (req, res) => {
  const { db } = await connectToDatabase();

  const contracts = await db.collection("contracts").find().toArray();

  let pools: { [id: string]: any } = {};
  for (const contract of contracts) {
    if (contract._id === "C_1uo08qRuQAeDi9Y1I8fkaWYUC9IWkOrKDNe9EphJo")
      continue;

    pools[contract._id] = contract.state;
  }

  res.json(pools);
};
