import useConnected from "../../../hooks/useConnected";
import {
  Page,
  Grid,
  Card,
  Text,
  useMediaQuery,
  Spacer,
  Select,
} from "@geist-ui/react";
import Footer from "../../../components/Footer";
import CreatePoolModal from "../../../components/Governance/pools/CreatePoolModal";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Nav from "../../../components/Nav";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../../../components/Logo";
import { PlusIcon } from "@primer/octicons-react";
import styles from "../../../styles/views/pools.module.sass";
import useSWR from "swr";

const Pools = () => {
  const router = useRouter();
  const connected = useConnected();

  const createPoolModal = useRef();
  const isMobile = useMediaQuery("mobile");
  const fadeInDelay = 0.065;

  const { data: pools } = useSWR("/api/pools", async (url: string) => {
    const res = await fetch(url);
    return await res.json();
  });

  const [runtime, setRuntime] = useState("all");
  const [runtimes, setRuntimes] = useState([]);
  useEffect(() => {
    if (pools) {
      const list = Object.values(pools)
        .map((pool: any) => pool.settings.runtime)
        .filter((runtime) => runtime);

      setRuntimes([...new Set(list)]);
    }
  }, pools);

  const [filtered, setFiltered] = useState([]);
  useEffect(() => {
    if (pools) {
      if (runtime === "all") setFiltered(pools);
      else {
        const filtered = [];
        for (const pool of pools) {
          if (pool.settings.runtime === runtime) {
            filtered.push(pool);
          }
        }

        setFiltered(filtered);
      }
    }
  }, [runtime, pools]);

  if (!pools) return null;

  return (
    <>
      <Nav />
      <Page>
        <Select value={runtime} onChange={(val) => setRuntime(val.toString())}>
          <Select.Option value="all">All Runtimes</Select.Option>
          {runtimes.map((runtime) => (
            <Select.Option value={runtime}>{runtime}</Select.Option>
          ))}
        </Select>
        <Spacer y={1} />
        <Grid.Container
          gap={isMobile ? undefined : 8}
          style={{ display: isMobile ? "block" : undefined }}
        >
          {filtered.map(({ id, settings, balance, validators }, index) => (
            <>
              {settings && (
                <Grid xs={isMobile ? undefined : 8}>
                  <motion.div
                    initial={{ scale: 0.75, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      duration: 0.23,
                      ease: "easeInOut",
                      delay: index * fadeInDelay,
                    }}
                    style={{ width: "100%", height: "100%" }}
                  >
                    <Card
                      onClick={() => {
                        router.push(`/gov/pools/${id}`);
                      }}
                      className={"Card " + styles.PoolCard}
                      style={{ height: "100%", cursor: "pointer" }}
                    >
                      <div className={styles.Logo}>
                        {settings.logo.startsWith("https://") ? (
                          // Logo is a URL.
                          <img src={settings.logo} />
                        ) : (
                          <>
                            {/[a-z0-9_-]{43}/i.test(settings.logo) ? (
                              // Logo is an Arweave transaction.
                              <img
                                src={`https://arweave.net/${settings.logo}`}
                              />
                            ) : (
                              // Fallback.
                              <Logo name={settings.logo || settings.runtime} />
                            )}
                          </>
                        )}
                      </div>
                      <Text h3>{settings.name}</Text>
                      <Text h5 type="secondary">
                        {settings.runtime}
                      </Text>
                      <Text h5 type="secondary">
                        {balance} $KYVE
                      </Text>
                      <Text h5 type="secondary">
                        {validators} validator{validators === 1 ? "" : "s"}{" "}
                        active
                      </Text>
                    </Card>
                  </motion.div>
                </Grid>
              )}
              {isMobile && <Spacer y={2} />}
            </>
          ))}
          <AnimatePresence>
            {connected && (
              <Grid xs={isMobile ? undefined : 8}>
                <motion.div
                  initial={{ scale: 0.75, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.75, opacity: 0 }}
                  transition={{
                    duration: 0.23,
                    ease: "easeInOut",
                    // @ts-ignore
                    delay: filtered.length * fadeInDelay,
                  }}
                  style={{ width: "100%", height: "100%" }}
                >
                  <Card
                    onClick={() => {
                      // @ts-ignore
                      createPoolModal.current.open();
                    }}
                    className={"Card " + styles.AddCard}
                    style={{
                      height: "100%",
                      cursor: "pointer",
                      position: "relative",
                    }}
                  >
                    <div className={styles.AddContent}>
                      <span>
                        <PlusIcon />
                      </span>
                      Add new
                    </div>
                  </Card>
                </motion.div>
              </Grid>
            )}
          </AnimatePresence>
          {isMobile && <Spacer y={2} />}
        </Grid.Container>
      </Page>
      <Footer />

      <CreatePoolModal ref={createPoolModal} />
    </>
  );
};

export default Pools;
