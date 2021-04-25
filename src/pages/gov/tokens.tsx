import {
  useMediaQuery,
  Link,
  Code,
  Text,
  Page,
  Table,
  useToasts,
  Spinner,
  Spacer,
  Tooltip,
} from "@geist-ui/react";
import useConnected from "../../hooks/useConnected";
import useContract from "../../hooks/useContract";
import { useState, useEffect, useRef } from "react";
import { ArrowSwitchIcon, PlusIcon } from "@primer/octicons-react";
import Footer from "../../components/Footer";
import TransferTokenModal from "../../components/Governance/tokens/TransferTokensModal";
import { dispense } from "../../contract";
import { AnimatePresence, motion } from "framer-motion";
import Nav from "../../components/Nav";
import styles from "../../styles/views/tokens.module.sass";

const Tokens = () => {
  const isMobile = useMediaQuery("mobile");

  const [toasts, setToast] = useToasts();
  const [loading, setLoading] = useState(false);

  const connected = useConnected();
  const { state, height } = useContract();

  const transferTokenModal = useRef();

  const [data, setData] = useState([]);
  useEffect(() => {
    if (state) {
      const data = [];
      for (const addr of Object.keys(state.balances)) {
        const balance = state.balances[addr];
        const locked =
          addr in Object.keys(state.vault || {})
            ? state.vault[addr]
                .map((element) => element.amount)
                .reduce((a, b) => a + b, 0)
            : 0;

        const formatted =
          addr.slice(0, 5) + "..." + addr.slice(addr.length - 5, addr.length);

        data.push({
          address: isMobile ? formatted : addr,
          balance,
          locked,
          total: balance + locked,
        });
      }
      setData(data.sort((a, b) => b.total - a.total));
    }
  }, [state]);

  return (
    <>
      <Nav />
      <Page>
        <AnimatePresence>
          {connected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="ActionSheet"
            >
              <Tooltip text="Dispense tokens">
                <span
                  className="Btn"
                  onClick={async () => {
                    setLoading(true);
                    const id = await dispense();
                    setToast({
                      text: `Successfully dispensed tokens. Please wait for tx: ${id} to mine.`,
                    });
                    setLoading(false);
                  }}
                >
                  {loading ? (
                    <Spinner
                      style={{
                        height: "1em",
                        width: "1em",
                      }}
                    />
                  ) : (
                    <PlusIcon />
                  )}
                </span>
              </Tooltip>
              <Spacer y={1} />
              <Tooltip text="Transfer">
                <span
                  className="Btn"
                  onClick={() => {
                    // @ts-ignore
                    transferTokenModal.current.open();
                  }}
                >
                  <ArrowSwitchIcon />
                </span>
              </Tooltip>
            </motion.div>
          )}
        </AnimatePresence>
        {data.map(({ address, balance, locked }, i) => (
          <>
            <motion.div
              className={"Card " + styles.Card}
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.23, ease: "easeInOut", delay: i * 0.1 }}
              onClick={() =>
                window.open(`https://viewblock.io/arweave/address/${address}`)
              }
            >
              <p>{address}</p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div className={styles.Data}>
                  <p>Balance</p>
                  <h1>{balance} $KYVE</h1>
                </div>
                <div className={styles.Data}>
                  <p>Locked balance</p>
                  <h1>{locked} $KYVE</h1>
                </div>
              </div>
            </motion.div>
            <Spacer y={1} />
          </>
        ))}
      </Page>
      <TransferTokenModal ref={transferTokenModal} />
      <Footer />
    </>
  );
};

export default Tokens;
