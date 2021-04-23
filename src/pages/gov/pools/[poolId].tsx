import useContract from "../../../hooks/useContract";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import {
  Card,
  Dot,
  Grid,
  Page,
  Spacer,
  Table,
  Tabs,
  Text,
  useMediaQuery,
  useToasts,
} from "@geist-ui/react";
import useConnected from "../../../hooks/useConnected";
import FundPoolModal from "../../../components/Governance/pools/FundPoolModal";
import LockTokensModal from "../../../components/Governance/pools/LockTokensModal";
import Footer from "../../../components/Footer";
import { interactWrite } from "smartweave";
import { arweave } from "../../../extensions";
import { CONTRACT as CONTRACT_ID } from "@kyve/logic";
import { motion } from "framer-motion";
import VotesGrid from "../../../components/Governance/pools/VotesGrid";
import UpdatePoolModal from "../../../components/Governance/pools/UpdatePoolModal";
import Nav from "../../../components/Nav";
import Button from "../../../components/Button";
import tokenStyles from "../../../styles/views/tokens.module.sass";

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

  useEffect(() => {
    if (loading) return;
    const upl = state.pools[poolID].uploader;
    setPoolUploader(
      isMobile
        ? upl.slice(0, 5) + "..." + upl.slice(upl.length - 5, upl.length)
        : upl
    );
  }, [loading, isMobile]);

  const DisplayCard = (props) => {
    return (
      <Card>
        <Text h5>{props.headline}</Text>
        <Text p>{props.text}</Text>
      </Card>
    );
  };

  const [toasts, setToast] = useToasts();

  const unlockTokens = async () => {
    const input = {
      function: "unlock",
      id: poolID,
    };
    console.log(input);
    const state = await interactWrite(arweave, undefined, CONTRACT_ID, input);
    console.log(state);
    setToast({ text: "Tokens successfully unlocked", type: "success" });
  };

  return (
    <>
      <Nav />
      <Page>
        {!loading && (
          <>
            <Text h2 style={{ fontWeight: 800 }}>
              {pool.name}
            </Text>
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
                        <h1 style={{ textAlign: "left" }}>{address}</h1>
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
                          <h1 style={{ textAlign: "left" }}>{address}</h1>
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
                <VotesGrid votes={state.votes} poolID={poolID} />
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
