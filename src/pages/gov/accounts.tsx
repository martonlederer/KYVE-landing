import {
  Page,
  Spacer,
  Spinner,
  Tag,
  Tooltip,
  useMediaQuery,
  useToasts,
} from "@geist-ui/react";
import useConnected from "../../hooks/useConnected";
import useContract from "../../hooks/useContract";
import { useEffect, useRef, useState } from "react";
import { ArrowSwitchIcon, PlusIcon } from "@primer/octicons-react";
import Footer from "../../components/Footer";
import TransferTokenModal from "../../components/Governance/tokens/TransferTokensModal";
import { AnimatePresence, motion } from "framer-motion";
import Nav from "../../components/Nav";
import styles from "../../styles/views/tokens.module.sass";
import { interactWrite } from "smartweave";
import { arweave } from "../../extensions";
import useSWR from "swr";

const Tokens = () => {
  const isMobile = useMediaQuery("mobile");
  const [toasts, setToast] = useToasts();
  const [loading, setLoading] = useState(false);
  const connected = useConnected();
  const transferTokenModal = useRef();

  const { data: state } = useSWR(
    "/api/pool?id=C_1uo08qRuQAeDi9Y1I8fkaWYUC9IWkOrKDNe9EphJo",
    async (url: string) => {
      const res = await fetch(url);
      return await res.json();
    }
  );

  const { data: pools } = useSWR("/api/pools", async (url: string) => {
    const res = await fetch(url);
    return await res.json();
  });

  const [accounts, setAccounts] = useState<
    {
      address: string;
      balance: number;
      stake: number;
      total: number;
      pool: boolean;
    }[]
  >([]);
  useEffect(() => {
    if (state && pools) {
      for (const address of Object.keys(state.balances)) {
        let stake = 0;
        if (address in state.vault) {
          stake = state.vault[address]
            .map((entry) => entry.balance)
            .reduce((a, b) => a + b, 0);
        }

        setAccounts((accounts) =>
          [
            ...accounts,
            {
              address,
              balance: state.balances[address],
              stake,
              total: state.balances[address] + stake,
              pool: address in pools,
            },
          ].sort((a, b) => b.total - a.total)
        );
      }
    }
  }, [state, pools]);

  if (!state || !pools) return null;

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
                    const id = await interactWrite(
                      // @ts-ignore
                      arweave,
                      "use_wallet",
                      "C_1uo08qRuQAeDi9Y1I8fkaWYUC9IWkOrKDNe9EphJo",
                      {
                        function: "dispense",
                      }
                    );
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
        {accounts.map(({ address, balance, stake, pool }, i) => (
          <>
            <motion.div
              className={"Card " + styles.Card}
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.23, ease: "easeInOut", delay: i * 0.1 }}
              onClick={() => {
                if (pool) window.open(`/gov/pools/${address}`);
                else
                  window.open(
                    `https://viewblock.io/arweave/address/${address}`
                  );
              }}
            >
              <p>
                {address} {pool && <Tag type="lite">Pool</Tag>}
              </p>
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
                  <p>Stake</p>
                  <h1>{stake} $KYVE</h1>
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
