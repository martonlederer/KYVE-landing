import { Spacer } from "@geist-ui/react";
import { Query } from "@kyve/query";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import styles from "../../../styles/views/tokens.module.sass";

const TransactionList = (props: { id: number }) => {
  const query = new Query(props.id, false);
  const [data, setData] = useState<{ id: string; timestamp: number }[]>([]);

  useEffect(() => {
    (async () => {
      const res: any[] = await query
        .only(["id", "block", "block.timestamp"])
        .find();

      setData(
        res.map((entry) => ({
          id: entry.id,
          timestamp: entry.block.timestamp * 1000,
        }))
      );
    })();
  }, []);

  console.log(data);

  return (
    <>
      {data.map(({ id, timestamp }, i) => (
        <>
          <motion.div
            className={"Card " + styles.Card}
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.23, ease: "easeInOut", delay: i * 0.1 }}
            onClick={() => window.open(`https://viewblock.io/arweave/tx/${id}`)}
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
                <p>Timestamp</p>
                <h1>
                  {new Intl.DateTimeFormat("en", {
                    // @ts-ignore
                    timeStyle: "medium",
                    dateStyle: "short",
                  }).format(timestamp)}
                </h1>
              </div>
            </div>
          </motion.div>
          <Spacer y={1} />
        </>
      ))}
    </>
  );
};

export default TransactionList;
