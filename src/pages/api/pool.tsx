import { withSentry } from "@sentry/nextjs";
import { connectToDatabase } from "../../utils/mongodb";

// "all", "meta", "txs", "unhandledTxs"
const handler = async (req, res) => {
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
    const transactions = await db
      .collection("contracts")
      .aggregate([
        {
          $match: {
            _id: id,
          },
        },
        {
          $project: {
            _id: 0,
            tx: {
              $reverseArray: {
                $objectToArray: "$state.txs",
              },
            },
          },
        },
        {
          $unwind: "$tx",
        },
        {
          $project: {
            id: "$tx.k",
            status: "$tx.v.status",
            yays: "$tx.v.yays",
            nays: "$tx.v.nays",
            voters: "$tx.v.voters",
            closesAt: "$tx.v.closesAt",
            confirmedAt: "$tx.v.confirmedAt",
          },
        },
      ])
      .limit(100)
      .toArray();

    pool = transactions;
  }
  if (type === "unhandledTxs") {
    const transactions: { id: string; data: any }[] = await db
      .collection("contracts")
      .aggregate([
        {
          $match: {
            _id: id,
          },
        },
        {
          $project: {
            _id: 0,
            tx: {
              $objectToArray: "$state.txs",
            },
          },
        },
        {
          $unwind: "$tx",
        },
        {
          $match: {
            "tx.v.status": "pending",
          },
        },
        {
          $project: {
            id: "$tx.k",
            data: "$tx.v",
          },
        },
      ])
      .toArray();

    pool = {};
    for (const { id, data } of transactions) {
      pool[id] = data;
    }
  }

  res.json(pool.state || pool);
};

export default withSentry(handler);
