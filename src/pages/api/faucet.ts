import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../utils/mongodb";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { address, tweetID } = req.query as {
    address?: string;
    tweetID?: string;
  };
  if (!address) {
    res.json("no address supplied");
    return;
  }

  const { faucet } = await connectToDatabase();
  const faucetData = await faucet.findOne({ address });

  if (req.method === "POST") {
    if (!tweetID) {
      res.json("no tweetID supplied");
      return;
    }
    if (faucetData) {
      res.json("entry already exists");
      return;
    }

    const { insertedId: id } = await faucet.insertOne({
      address,
      tweetID,
    });
    res.json(id);
  }

  if (req.method === "GET") {
    if (faucetData) {
      res.json(faucetData);
    } else {
      res.json("unclaimed");
    }
  }
};
