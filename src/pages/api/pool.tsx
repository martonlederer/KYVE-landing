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

    const txsRes = await db
      .collection("txs")
      .find({ contract: id }, { sort: { index: 1 } })
      .toArray();
    let txs: { [txID: string]: any } = {};
    txsRes.map(({ txID, data }) => (txs[txID] = data));
    pool.state.txs = txs;

    const invocations = (
      await db
        .collection("invocations")
        .find({ contract: id }, { sort: { index: 1 } })
        .toArray()
    ).map(({ data }) => data);
    pool.state.invocations = invocations;

    const foreignCalls = (
      await db
        .collection("foreignCalls")
        .find({ contract: id }, { sort: { index: 1 } })
        .toArray()
    ).map(({ data }) => data);
    pool.state.foreignCalls = foreignCalls;
  }
  if (type === "meta") {
    const contract = await db.collection("contracts").findOne({ _id: id });

    pool = contract;
  }
  if (type === "txs") {
    const transactions = await db
      .collection("txs")
      .find({ contract: id }, { sort: { index: -1 } })
      .limit(100)
      .toArray();

    pool = transactions.map(({ txID, data }) => ({ id: txID, ...data }));
  }
  if (type === "unhandledTxs") {
    const transactions = await db
      .collection("txs")
      .find({ contract: id, "data.status": "pending" }, { sort: { index: 1 } })
      .toArray();

    pool = {};
    transactions.map(({ txID, data }) => (pool[txID] = data));
  }

  res.json(pool.state || pool);
};

export default withSentry(handler);
