import { Spacer, Text } from "@geist-ui/react";
import { motion } from "framer-motion";
import styles from "../../../styles/views/tokens.module.sass";

const TransactionList = (props: {
  txs: {
    [id: string]: { status: "pending" | "dropped" | "valid" | "invalid" };
  };
}) => {
  return (
    <>
      {Object.entries(props.txs)
        .reverse()
        .map(([id, tx], i) => (
          <>
            <motion.div
              className={"Card " + styles.Card}
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.23, ease: "easeInOut", delay: i * 0.1 }}
              onClick={() =>
                window.open(`https://viewblock.io/arweave/tx/${id}`)
              }
            >
              <p>{id}</p>
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
                  <h1>{tx.status}</h1>
                </div>
              </div>
            </motion.div>
            <Spacer y={1} />
          </>
        ))}
      {!props.txs.length && <Text>No data yet.</Text>}
    </>
  );
};

export default TransactionList;
