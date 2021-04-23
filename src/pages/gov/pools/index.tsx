import useConnected from "../../../hooks/useConnected";
import useContract from "../../../hooks/useContract";
import { Page, Grid, Card, Text } from "@geist-ui/react";
import { PlusIcon } from "@primer/octicons-react";
import Footer from "../../../components/Footer";
import CreatePoolModal from "../../../components/Governance/pools/CreatePoolModal";
import { useRef } from "react";
import { useRouter } from "next/router";
import Nav from "../../../components/Nav";

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
          <Grid.Container gap={1}>
            {state.pools.map((pool, id) => (
              <Grid>
                <Card
                  style={{ border: "1px dashed #333", cursor: "pointer" }}
                  onClick={() => {
                    router.push(`/gov/pools/${id}`);
                  }}
                >
                  <Text h3>{pool.name}</Text>
                  <Text h5>ID: {id}</Text>
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
