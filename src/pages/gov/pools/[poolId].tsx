import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Dot, Page, Spacer, Tabs, Text, Tooltip } from "@geist-ui/react";
import useConnected from "../../../hooks/useConnected";
import FundPoolModal from "../../../components/Governance/pools/FundPoolModal";
import Footer from "../../../components/Footer";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  PlusCircleIcon,
} from "@primer/octicons-react";
import Nav from "../../../components/Nav";
import Logo from "../../../components/Logo";
import tokenStyles from "../../../styles/views/tokens.module.sass";
import styles from "../../../styles/views/pools.module.sass";
import TransactionList from "../../../components/Governance/pools/TransactionList";
import useSWR from "swr";
import Highlight from "react-highlight";
import DepositModal from "../../../components/Governance/pools/DepositModal";
import WithdrawModal from "../../../components/Governance/pools/WithdrawModal";

const Pool = () => {
  const router = useRouter();
  const { data: pool } = useSWR(
    `/api/pool?id=${router.query.poolId}`,
    async (url: string) => {
      const res = await fetch(url);
      return await res.json();
    }
  );

  const depositModal = useRef();
  const withdrawModal = useRef();
  const fundPoolModal = useRef();

  const connected = useConnected();
  const [balance, setBalance] = useState(0);
  const [stake, setStake] = useState(0);
  useEffect(() => {
    if (pool) {
      setBalance(
        Object.values(pool.credit)
          .map((credit: any) => credit.fund)
          .reduce((a, b) => a + b, 0)
      );

      setStake(
        Object.values(pool.credit)
          .map((credit: any) => credit.stake)
          .reduce((a, b) => a + b, 0)
      );
    }
  }, pool);

  if (!pool) return null;

  return (
    <>
      <Nav />
      <Page>
        <>
          <div className={styles.PoolHeader}>
            <Text h2 className={styles.PoolName}>
              <div className={styles.ArchitectureLogo}>
                {/* @ts-ignore */}
                {pool.settings.logo ? (
                  // @ts-ignore
                  <img
                    src={`https://arweave.net/${pool.settings.logo}`}
                    style={{ borderRadius: "50%" }}
                  />
                ) : (
                  // @ts-ignore
                  <Logo name={pool.settings.runtime} />
                )}
              </div>
              {pool.settings.name}
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
                  <Tooltip text="Deposit into pool.">
                    <span
                      className="Btn"
                      onClick={() => {
                        //@ts-ignore
                        depositModal.current.open();
                      }}
                    >
                      <ArrowDownIcon />
                    </span>
                  </Tooltip>
                  <Spacer y={1} />
                  <Tooltip text="Withdraw from pool.">
                    <span
                      className="Btn"
                      onClick={() => {
                        //@ts-ignore
                        withdrawModal.current.open();
                      }}
                    >
                      <ArrowUpIcon />
                    </span>
                  </Tooltip>
                  <Spacer y={1} />
                  <Tooltip text="Fund pool.">
                    <span
                      className="Btn"
                      onClick={() => {
                        //@ts-ignore
                        fundPoolModal.current.open();
                      }}
                    >
                      <PlusCircleIcon />
                    </span>
                  </Tooltip>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className={"Card " + tokenStyles.Card}>
            <p>
              <span style={{ marginRight: ".4em" }}>Runtime:</span>
              {pool.settings.runtime}
            </p>
            <div className={tokenStyles.Data}>
              <p>Uploader</p>
              <h1>{pool.settings.uploader}</h1>
            </div>
          </div>
          <Spacer y={1} />
          <div className={"Card " + tokenStyles.Card}>
            <p>
              {pool.settings.paused ? (
                <Dot type="warning">Paused</Dot>
              ) : (
                <>
                  {balance > 0 ? (
                    <Dot type="success">Active</Dot>
                  ) : (
                    <Dot type="error">Insufficient balance</Dot>
                  )}
                </>
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
                <h1>{balance} $KYVE</h1>
              </div>
              <div className={tokenStyles.Data}>
                <p>Locked balance</p>
                <h1>{stake} $KYVE</h1>
              </div>
            </div>
          </div>
          <Spacer y={2} />
          <Tabs initialValue="1">
            <Tabs.Item label="Accounts" value="1">
              <Spacer y={1} />
              {Object.entries(pool.credit).map(([address, credit], i) => (
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
                        {address.slice(0, 5) +
                          "..." +
                          address.slice(address.length - 5, address.length)}
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
                        <p>Unlocked</p>
                        {/* @ts-ignore */}
                        <h1>{credit.amount} $KYVE</h1>
                      </div>
                      <div className={tokenStyles.Data}>
                        <p>Funded</p>
                        {/* @ts-ignore */}
                        <h1>{credit.fund} $KYVE</h1>
                      </div>
                      <div className={tokenStyles.Data}>
                        <p>Staked</p>
                        {/* @ts-ignore */}
                        <h1>{credit.stake} $KYVE</h1>
                      </div>
                      <div className={tokenStyles.Data}>
                        <p>Points</p>
                        {/* @ts-ignore */}
                        <h1>{credit.points}</h1>
                      </div>
                    </div>
                  </motion.div>
                  <Spacer y={1} />
                </>
              ))}
            </Tabs.Item>
            <Tabs.Item label="Explore" value="2">
              <Spacer y={1} />
              <TransactionList txs={pool.txs} />
            </Tabs.Item>
            <Tabs.Item label="Config & Settings" value="3">
              <Spacer y={1} />
              <Text>Config</Text>
              <Highlight className="json">
                {JSON.stringify(pool.config, null, 2)}
              </Highlight>
              <Text>Settings</Text>
              <Highlight className="json">
                {JSON.stringify(pool.settings, null, 2)}
              </Highlight>
            </Tabs.Item>
          </Tabs>
        </>
      </Page>
      <Footer />
      <DepositModal pool={router.query.poolId.toString()} ref={depositModal} />
      <WithdrawModal
        pool={router.query.poolId.toString()}
        ref={withdrawModal}
      />
      <FundPoolModal
        pool={router.query.poolId.toString()}
        ref={fundPoolModal}
      />
    </>
  );
};

export default Pool;
