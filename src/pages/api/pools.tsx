import { connectToDatabase } from "../../utils/mongodb";

const GOVERNANCE = "C_1uo08qRuQAeDi9Y1I8fkaWYUC9IWkOrKDNe9EphJo";

const format = (input: number) => {
  return parseFloat(input.toFixed(2));
};

export default async (req, res) => {
  const { db } = await connectToDatabase();

  const contracts = await db
    .collection("contracts")
    .aggregate([
      {
        $project: {
          "state.credit": 1,
          "state.settings": 1,
        },
      },
    ])
    .toArray();

  const pools: {
    id: string;
    settings: Object;
    balance: number;
    validators: number;
  }[] = [];

  for (const { _id, state } of contracts) {
    if (_id === GOVERNANCE) continue;

    const balance = Object.values(state.credit)
      .map((entry: any) => entry.fund)
      .reduce((a, b) => a + b, 0);
    const validators = Object.entries(state.credit)
      .filter((entry: any) => entry[1].stake > 0)
      .map(([address, credit]) => address)
      .filter((address) => address !== state.settings.uploader).length;

    pools.push({
      id: _id,
      settings: state.settings,
      balance: format(balance),
      validators,
    });
  }

  res.json(pools.sort((a, b) => b.balance - a.balance));
};
