import { withSentry } from "@sentry/nextjs";
import { connectToDatabase } from "../../utils/mongodb";

const GOVERNANCE = "bf8TMruaXAAeymJbe9HIzf8edTe2kmLr5iPC_qNfkeQ";
const TREASURY = "7-yOavDvzo86K4dZOki5ZV9CRL332x40ceZlNP3O-2Y";

const format = (input: number) => {
  return parseFloat(input.toFixed(2));
};

const handler = async (req, res) => {
  const { db } = await connectToDatabase();

  const contracts = await db
    .collection("contractsDev")
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
    if (_id === TREASURY) continue;

    const balance = Object.values(state.credit || {})
      .map((entry: any) => entry.fund)
      .reduce((a, b) => a + b, 0);
    const validators = Object.entries(state.credit || {})
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

export default withSentry(handler);
