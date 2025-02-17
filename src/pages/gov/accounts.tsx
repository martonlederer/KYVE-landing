import { Page, Spacer, Tag, Tooltip, useMediaQuery } from "@geist-ui/react";
import useConnected from "../../hooks/useConnected";
import { useRef } from "react";
import { ArrowSwitchIcon } from "@primer/octicons-react";
import Footer from "../../components/Footer";
import TransferTokenModal from "../../components/Governance/tokens/TransferTokensModal";
import { AnimatePresence, motion } from "framer-motion";
import Nav from "../../components/Nav";
import styles from "../../styles/views/tokens.module.sass";
import useSWR from "swr";

const Tokens = () => {
  const isMobile = useMediaQuery("mobile");
  const connected = useConnected();
  const transferTokenModal = useRef();

  const { data: accounts } = useSWR(
    "https://api.kyve.network/accounts",
    async (url: string) => {
      const res = await fetch(url);
      return await res.json();
    }
  );

  if (!accounts) return null;

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
        {accounts.map(
          ({ address, formatted, type, balance, credit, stake }, i) => (
            <>
              <div
                className={"Card " + styles.Card}
                key={i}
                onClick={() => {
                  if (type === "pool") window.open(`/gov/pools/${address}`);
                  else
                    window.open(
                      `https://viewblock.io/arweave/address/${address}`
                    );
                }}
              >
                {isMobile ? (
                  <>
                    <p>{formatted}</p>
                    <>
                      {type === "pool" && <Tag type="lite">Pool</Tag>}{" "}
                      {type === "treasury" && <Tag type="lite">Treasury</Tag>}{" "}
                      {type === "faucet" && <Tag type="lite">Fauscet</Tag>}
                    </>
                  </>
                ) : (
                  <>
                    <p>
                      {address} {type === "pool" && <Tag type="lite">Pool</Tag>}{" "}
                      {type === "treasury" && <Tag type="lite">Treasury</Tag>}{" "}
                      {type === "faucet" && <Tag type="lite">Faucet</Tag>}
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
                        <p>Credit</p>
                        <h1>{credit} $KYVE</h1>
                      </div>
                      <div className={styles.Data}>
                        <p>Stake</p>
                        <h1>{stake} $KYVE</h1>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <Spacer y={1} />
            </>
          )
        )}
      </Page>
      <TransferTokenModal ref={transferTokenModal} />
      <Footer />
    </>
  );
};

export default Tokens;
