import useConnected from "../../../hooks/useConnected";
import useContract from "../../../hooks/useContract";
import { Page, Grid, Card, Text } from "@geist-ui/react";
import Footer from "../../../components/Footer";
import CreatePoolModal from "../../../components/Governance/pools/CreatePoolModal";
import { useRef } from "react";
import { useRouter } from "next/router";
import Nav from "../../../components/Nav";
import { motion } from "framer-motion";
import Logo from "../../../components/Logo";
import styles from "../../../styles/views/pools.module.sass";

const Pools = () => {
  const router = useRouter();
  const connected = useConnected();
  const { loading, state, height } = useContract();

  const authNodeModal = useRef();

  return (
    <>
      <Nav />
      <Page>
        {!loading && (
          <Grid.Container gap={8}>
            {state.pools.map((pool, id) => (
              <Grid xs={8}>
                <motion.div
                  initial={{ scale: 0.75, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    duration: 0.23,
                    ease: "easeInOut",
                    delay: id * 0.065,
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
                      <Logo name={pool.architecture} />
                    </div>
                    <Text h3>{pool.name}</Text>
                    <Text h5 type="secondary">
                      {pool.architecture}
                    </Text>
                    <Text h5 type="secondary">
                      {pool.balance} $KYVE
                    </Text>
                    <Text h5 type="secondary">
                      {pool.registered.length} Validators online
                    </Text>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid.Container>
        )}
      </Page>
      <Footer />

      <CreatePoolModal ref={authNodeModal} />
    </>
  );
};

export default Pools;
