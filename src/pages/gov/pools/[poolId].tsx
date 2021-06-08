import useContract from "../../../hooks/useContract";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import {
  Dot,
  Page,
  Spacer,
  Tabs,
  Text,
  Tooltip,
  useMediaQuery,
  useToasts,
} from "@geist-ui/react";
import useConnected from "../../../hooks/useConnected";
import FundPoolModal from "../../../components/Governance/pools/FundPoolModal";
import LockTokensModal from "../../../components/Governance/pools/LockTokensModal";
import Footer from "../../../components/Footer";
import { contract } from "../../../extensions";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertIcon,
  DatabaseIcon,
  LockIcon,
  PencilIcon,
} from "@primer/octicons-react";
import VotesGrid from "../../../components/Governance/pools/VotesGrid";
import UpdatePoolModal from "../../../components/Governance/pools/UpdatePoolModal";
import Nav from "../../../components/Nav";
import Button from "../../../components/Button";
import Logo from "../../../components/Logo";
import tokenStyles from "../../../styles/views/tokens.module.sass";
import styles from "../../../styles/views/pools.module.sass";
import TransactionList from "../../../components/Governance/pools/TransactionList";

const Pool = () => {
  const fundPoolModal = useRef();
  const lockTokensModal = useRef();
  const updatePoolModal = useRef();

  const router = useRouter();
  const [pool, setPool]: any[] = useState({});
  const { loading, state, height } = useContract();

  const poolID = parseInt(router.query.poolId as string);

  const connected = useConnected();

  const [myAddress, setMyAddress] = useState("");
  const [unlockLoading, setUnlockLoading] = useState(false);

  useEffect(() => {
    if (connected) {
      // @ts-ignore
      window.arweaveWallet.getActiveAddress().then((address) => {
        setMyAddress(address);
      });
    }
  }, [connected]);

  const isMobile = useMediaQuery("mobile");
  const [poolUploader, setPoolUploader] = useState("");

  useEffect(() => {
    if (loading) return;
    setPool(state.pools[poolID]);
  }, [loading]);

  const formatAddress = (addr: string) =>
    isMobile
      ? addr.slice(0, 5) + "..." + addr.slice(addr.length - 5, addr.length)
      : addr;

  useEffect(() => {
    if (loading) return;
    const upl = state.pools[poolID].uploader;
    setPoolUploader(formatAddress(upl));
  }, [loading, isMobile]);

  const [, setToast] = useToasts();

  const unlockTokens = async () => {
    const txID = await contract.unlock(poolID);
    console.log(txID);
    setToast({ text: "Tokens successfully unlocked", type: "success" });
  };

  return (
    <>
      <Nav />
      <Page>
        {!loading && (
          <>
            <div className={styles.PoolHeader}>
              <Text h2 className={styles.PoolName}>
                {pool.architecture && (
                  <div className={styles.ArchitectureLogo}>
                    <Logo name={pool.architecture.toLowerCase()} />
                  </div>
                )}
                {pool.name}
              </Text>
              <AnimatePresence>
                {connected && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="ActionSheet"
                    style={{ marginBottom: 0 }}
                  >
                    <Tooltip text="Edit pool">
                      <span
                        className="Btn"
                        onClick={() => {
                          //@ts-ignore
                          updatePoolModal.current.open();
                        }}
                      >
                        <PencilIcon />
                      </span>
                    </Tooltip>
                    <Spacer y={1} />
                    <Tooltip text="Lock tokens">
                      <span
                        className="Btn"
                        onClick={() => {
                          //@ts-ignore
                          lockTokensModal.current.open();
                        }}
                      >
                        <LockIcon />
                      </span>
                    </Tooltip>
                    <Spacer y={1} />
                    <Tooltip text="Fund pool">
                      <span
                        className="Btn"
                        onClick={() => {
                          //@ts-ignore
                          fundPoolModal.current.open();
                        }}
                      >
                        <DatabaseIcon />
                      </span>
                    </Tooltip>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className={"Card " + tokenStyles.Card}>
              <p>
                <span style={{ marginRight: ".4em" }}>Architecture:</span>
                {pool.architecture}
              </p>
              <div className={tokenStyles.Data}>
                <p>Uploader</p>
                <h1>{poolUploader}</h1>
              </div>
            </div>
            <Spacer y={1} />
            <div className={"Card " + tokenStyles.Card}>
              <p>
                {pool.balance > 0 ? (
                  <Dot type="success">Active</Dot>
                ) : (
                  <Dot type="error">Insufficient balance</Dot>
                )}
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div className={tokenStyles.Data}>
                  <p>Balance</p>
                  <h1>{pool.balance} $KYVE</h1>
                </div>
                <div className={tokenStyles.Data}>
                  <p>Locked balance</p>
                  <h1>
                    {(() => {
                      let sum = 0;
                      Object.values(pool.vault || {}).map(
                        (v: number) => (sum += v)
                      );
                      return sum;
                    })()}{" "}
                    $KYVE
                  </h1>
                </div>
              </div>
            </div>
            <Spacer y={2} />
            <Tabs initialValue="1">
              <Tabs.Item label="Validators" value="1">
                <Spacer y={1} />
                {(pool.registered || []).map((address, i) => (
                  <>
                    <motion.div
                      className={"Card " + tokenStyles.Card}
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.23,
                        ease: "easeInOut",
                        delay: i * 0.05,
                      }}
                    >
                      <div
                        className={tokenStyles.Data}
                        style={{ margin: ".6em 0", textAlign: "left" }}
                      >
                        <p style={{ textAlign: "left" }}>Address</p>
                        <h1 style={{ textAlign: "left" }}>
                          {formatAddress(address)}
                        </h1>
                      </div>
                      <div className={tokenStyles.Data}>
                        <p>Stake</p>
                        <h1>{pool.vault[address] || 0} $KYVE</h1>
                      </div>
                    </motion.div>
                    <Spacer y={1} />
                  </>
                ))}
              </Tabs.Item>
              <Tabs.Item label="Vault" value="2">
                <Spacer y={1} />
                {((Object.keys(pool.vault || {}) || []).length === 0 && (
                  <p style={{ textAlign: "center" }}>Nothing in vault</p>
                )) ||
                  (Object.keys(pool.vault || {}) || []).map((address, i) => (
                    <>
                      <motion.div
                        className={"Card " + tokenStyles.Card}
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.23,
                          ease: "easeInOut",
                          delay: i * 0.05,
                        }}
                      >
                        <div
                          className={tokenStyles.Data}
                          style={{ margin: ".6em 0", textAlign: "left" }}
                        >
                          <p style={{ textAlign: "left" }}>Address</p>
                          <h1 style={{ textAlign: "left" }}>
                            {formatAddress(address)}
                          </h1>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div className={tokenStyles.Data}>
                            <p>Locked</p>
                            <h1>{pool.vault[address] || 0} $KYVE</h1>
                          </div>
                          {myAddress === address && (
                            <div className={tokenStyles.Data}>
                              <Button
                                buttonSize="small"
                                onClick={async () => {
                                  setUnlockLoading(true);
                                  await unlockTokens();
                                  setUnlockLoading(false);
                                }}
                              >
                                Unlock
                              </Button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                      <Spacer y={1} />
                    </>
                  ))}
              </Tabs.Item>
              <Tabs.Item label="Votes" value="3">
                <Spacer y={1} />
                <VotesGrid id={poolID} votes={state.votes} height={height} />
              </Tabs.Item>
              <Tabs.Item
                label={
                  <>
                    <AlertIcon />
                    Explore
                  </>
                }
                value="4"
              >
                <Spacer y={1} />
                <TransactionList id={poolID} />
              </Tabs.Item>
            </Tabs>
          </>
        )}
      </Page>
      <Footer />
      <FundPoolModal pool={poolID} ref={fundPoolModal} />
      <LockTokensModal pool={poolID} ref={lockTokensModal} />
      <UpdatePoolModal pool={pool} poolID={poolID} ref={updatePoolModal} />
    </>
  );
};

export default Pool;
