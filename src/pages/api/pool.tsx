import { connectToDatabase } from "../../utils/mongodb";

// "all", "meta", "txs"
export default async (req, res) => {
  let { id, type } = req.query;
  type = type || "all";
  const { db } = await connectToDatabase();

  let pool;
  if (type === "all") {
    pool = await db.collection("contracts").findOne({ _id: id });
  }
  if (type === "meta") {
    const contracts = await db
      .collection("contracts")
      .aggregate([
        {
          $match: {
            _id: id,
          },
        },
        {
          $project: {
            "state.credit": 1,
            "state.config": 1,
            "state.settings": 1,
          },
        },
      ])
      .limit(1)
      .toArray();

    pool = contracts[0];
  }
  if (type === "txs") {
    const contracts = await db
      .collection("contracts")
      .aggregate([
        {
          $match: {
            _id: id,
          },
        },
        {
          $project: {
            "state.txs": 1,
          },
        },
      ])
      .limit(1)
      .toArray();

    pool = contracts[0];
  }

  res.json(pool.state);
};
