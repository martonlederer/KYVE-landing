import { Spacer, Text } from "@geist-ui/react";
import { motion } from "framer-motion";
import useSWR from "swr";
import styles from "../../../styles/views/tokens.module.sass";

const TransactionList = (props: { id: string }) => {
  const { data: txs } = useSWR(
    `https://kyve-cache-staging.herokuapp.com/pool?id=${props.id}&type=txs`,
    async (url: string) => {
      const res = await fetch(url);
      return await res.json();
    }
  );

  if (!txs) return null;

  return (
    <>
      {txs.map((tx, i) => (
        <>
          <div
            className={"Card " + styles.Card}
            key={i}
            onClick={() =>
              window.open(`https://viewblock.io/arweave/tx/${tx.id}`)
            }
          >
            <p>{tx.id}</p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div className={styles.Data}>
                <p>Status</p>
                {/* @ts-ignore */}
                <h1>{tx.status}</h1>
              </div>
              <div className={styles.Data}>
                <p>Finalized At</p>
                {/* @ts-ignore */}
                <h1>{tx.finalizedAt}</h1>
              </div>
            </div>
          </div>
          <Spacer y={1} />
        </>
      ))}
      {!txs.length && <Text>No data yet.</Text>}
    </>
  );
};

export default TransactionList;
