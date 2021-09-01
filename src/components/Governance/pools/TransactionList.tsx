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
          <motion.div
            className={"Card " + styles.Card}
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.23, ease: "easeInOut", delay: i * 0.1 }}
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
                <p>Yays</p>
                {/* @ts-ignore */}
                <h1>{tx.yays.length}</h1>
              </div>
              <div className={styles.Data}>
                <p>Nays</p>
                {/* @ts-ignore */}
                <h1>{tx.nays.length}</h1>
              </div>
              <div className={styles.Data}>
                <p>Status</p>
                {/* @ts-ignore */}
                <h1>{tx.status}</h1>
              </div>
            </div>
          </motion.div>
          <Spacer y={1} />
        </>
      ))}
      {!txs.length && <Text>No data yet.</Text>}
    </>
  );
};

export default TransactionList;
