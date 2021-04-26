import Arweave from "arweave";
import Contract from "@kyve/contract-lib";

export const arweave = new Arweave({
  host: "arweave.net",
  port: 443,
  protocol: "https",
});

export const contract = new Contract(arweave);
