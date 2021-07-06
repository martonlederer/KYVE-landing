import { connectToDatabase } from "../../utils/mongodb";

export default async (req, res) => {
  const { id } = req.query;
  const { db } = await connectToDatabase();

  const pool = await db.collection("contracts").findOne({ _id: id });

  res.json(pool.state);
};
