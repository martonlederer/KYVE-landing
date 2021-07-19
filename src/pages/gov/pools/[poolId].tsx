import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import {
  Dot,
  Page,
  Spacer,
  Spinner,
  Tabs,
  Text,
  Tooltip,
  useToasts,
} from "@geist-ui/react";
import useConnected from "../../../hooks/useConnected";
import FundPoolModal from "../../../components/Governance/pools/FundPoolModal";
import Footer from "../../../components/Footer";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  PlusCircleIcon,
  SyncIcon,
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
import { arweave } from "../../../extensions";
import { Pool as KYVEPool } from "@kyve/contract-lib";

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
  const [loading, setLoading] = useState(false);
  const [toasts, setToast] = useToasts();

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
                {pool.settings.logo.startsWith("https://") ? (
                  // Logo is a URL.
                  <img src={pool.settings.logo} />
                ) : (
                  <>
                    {/[a-z0-9_-]{43}/i.test(pool.settings.logo) ? (
                      // Logo is an Arweave transaction.
                      <img src={`https://arweave.net/${pool.settings.logo}`} />
                    ) : (
                      // Fallback.
                      <Logo
                        name={pool.settings.logo || pool.settings.runtime}
                      />
                    )}
                  </>
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
                  <Tooltip text="Deposit into pool." placement="left">
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
                  <Tooltip text="Withdraw from pool." placement="left">
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
                  <Tooltip text="Fund pool." placement="left">
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
                  <Spacer y={1} />
                  <Tooltip text="Process outbox." placement="left">
                    <span
                      className="Btn"
                      onClick={async () => {
                        setLoading(true);
                        const pool = new KYVEPool(
                          arweave,
                          "use_wallet",
                          router.query.poolId.toString()
                        );
                        await pool.processOutbox();
                        setLoading(false);
                        setToast({
                          text: "Successfully processed outbox.",
                          type: "success",
                        });
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
                        <SyncIcon />
                      )}
                    </span>
                  </Tooltip>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Spacer y={0.5} />
          <div className={"Card " + tokenStyles.Card}>
            <p>
              <span style={{ marginRight: ".4em" }}>Runtime:</span>
              {pool.settings.runtime}
            </p>
            <div className={tokenStyles.Data}>
              <p>Uploader</p>
              <h1>{pool.settings.uploader || "No uploader selected."}</h1>
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
                {/* @ts-ignore */}
                <h1>{parseFloat(parseFloat(balance).toFixed(2))} $KYVE</h1>
              </div>
              <div className={tokenStyles.Data}>
                <p>Locked balance</p>
                {/* @ts-ignore */}
                <h1>{parseFloat(parseFloat(stake).toFixed(2))} $KYVE</h1>
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
                        <h1>
                          {parseFloat(
                            // @ts-ignore
                            parseFloat(credit.amount).toFixed(2)
                          )}{" "}
                          $KYVE
                        </h1>
                      </div>
                      <div className={tokenStyles.Data}>
                        <p>Funded</p>
                        <h1>
                          {/* @ts-ignore */}
                          {parseFloat(parseFloat(credit.fund).toFixed(2))} $KYVE
                        </h1>
                      </div>
                      <div className={tokenStyles.Data}>
                        <p>Staked</p>
                        <h1>
                          {/* @ts-ignore */}
                          {parseFloat(parseFloat(credit.stake).toFixed(2))}{" "}
                          $KYVE
                        </h1>
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
