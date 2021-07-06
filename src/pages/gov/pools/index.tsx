import useConnected from "../../../hooks/useConnected";
import {
  Page,
  Grid,
  Card,
  Text,
  useMediaQuery,
  Spacer,
  Tooltip,
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

  const authNodeModal = useRef();
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
      const list = Object.values(pools).map(
        (pool: any) => pool.settings.runtime
      );

      setRuntimes([...new Set(list)]);
    }
  }, pools);

  const [filtered, setFiltered] = useState({});
  useEffect(() => {
    if (pools) {
      if (runtime === "all") setFiltered(pools);
      else {
        const filtered = {};
        for (const [id, pool] of Object.entries(pools)) {
          // @ts-ignore
          if (pool.settings.runtime === runtime) {
            filtered[id] = pool;
          }
        }

        console.log(filtered);
        setFiltered(filtered);
      }
    }
  }, [runtime, pools]);

  if (!pools) return null;

  return (
    <>
      <Nav />
      <Page>
        <Grid.Container
          gap={isMobile ? undefined : 8}
          style={{ display: isMobile ? "block" : undefined }}
        >
          <Select
            value={runtime}
            onChange={(val) => setRuntime(val.toString())}
          >
            <Select.Option value="all">All Runtimes</Select.Option>
            {runtimes.map((runtime) => (
              <Select.Option value={runtime}>{runtime}</Select.Option>
            ))}
          </Select>
          {Object.entries(filtered).map(([id, pool], index) => (
            <>
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
                      {/* @ts-ignore */}
                      {pool.settings.logo ? (
                        <></>
                      ) : (
                        // @ts-ignore
                        <Logo name={pool.settings.runtime} />
                      )}
                    </div>
                    {/* @ts-ignore */}
                    <Text h3>{pool.settings.name}</Text>
                    <Text h5 type="secondary">
                      {/* @ts-ignore */}
                      {pool.settings.runtime}
                    </Text>
                    <Text h5 type="secondary">
                      {/* @ts-ignore */}
                      {Object.values(pool.credit)
                        .map((entry: any) => entry.fund)
                        .reduce((a, b) => a + b, 0)}{" "}
                      $KYVE
                    </Text>
                    <Text h5 type="secondary">
                      {/* {pool.registered.length} Validators online */}
                    </Text>
                  </Card>
                </motion.div>
              </Grid>
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
                    delay: filtered.length * fadeInDelay,
                  }}
                  style={{ width: "100%", height: "100%" }}
                >
                  <Card
                    onClick={() => {
                      // @ts-ignore
                      authNodeModal.current.open();
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

      <CreatePoolModal ref={authNodeModal} />
    </>
  );
};

export default Pools;
