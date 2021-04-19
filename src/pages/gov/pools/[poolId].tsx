import useContract from "../../../hooks/useContract";
import {useEffect, useRef, useState} from "react";
import {useRouter} from "next/router";
import {
  Card,
  Dot,
  Grid,
  Page,
  Spacer,
  Table,
  Tabs,
  Text,
} from "@geist-ui/react";
import {DatabaseIcon, LockIcon} from "@primer/octicons-react";
import Nav from "../../../components/Governance/Nav";
import useConnected from "../../../hooks/useConnected";
import FundPoolModal from "../../../components/Governance/pools/FundPoolModal";
import LockTokensModal from "../../../components/Governance/pools/LockTokensModal";
import Footer from "../../../components/Governance/Footer";

const Pool = () => {
  const fundPoolModal = useRef();
  const lockTokensModal = useRef();

  const router = useRouter();
  const [pool, setPool]: any[] = useState({});
  const {loading, state, height} = useContract();

  const poolID = parseInt(router.query.poolId as string);

  const connected = useConnected();

  useEffect(() => {
    if (loading) return;
    setPool(state.pools[poolID]);
  }, [loading]);

  const DisplayCard = (props) => {
    return (
      <Card>
        <Text h5>{props.headline}</Text>
        <Text p>{props.text}</Text>
      </Card>
    );
  };

  return (
    <>
      <Page>
        <Nav>
          {connected && (
            <>
              <span
                onClick={() => {
                  //@ts-ignore
                  lockTokensModal.current.open();
                }}
                style={{cursor: "pointer"}}
              >
                <LockIcon/>
              </span>
              <Spacer x={0.5}/>
              <span
                onClick={() => {
                  //@ts-ignore
                  fundPoolModal.current.open();
                }}
                style={{cursor: "pointer"}}
              >
                <DatabaseIcon/>
              </span>
            </>
          )}
        </Nav>
        {!loading && (
          <>
            <Text h4>{pool.name}</Text>
            <Grid.Container gap={2}>
              <Grid>
                <DisplayCard headline="Architecture" text={pool.architecture}/>
              </Grid>
              <Grid>
                <DisplayCard headline="Balance" text={pool.balance}/>
              </Grid>
              <Grid>
                <DisplayCard headline="Uploader" text={pool.uploader}/>
              </Grid>
              <Grid>
                <DisplayCard
                  headline="Status"
                  text={
                    pool.balance > 0 ? (
                      <Dot type="success">Active</Dot>
                    ) : (
                      <Dot type="error">Insufficient balance</Dot>
                    )
                  }
                />
              </Grid>
              <Grid>
                <DisplayCard headline="$KYVE locked" text={(() => {
                  let sum = 0;
                  Object.values(pool.vault || {}).map((v: number) => (sum += v));
                  return sum;
                })()}/>
              </Grid>
            </Grid.Container>
            <Spacer y={2}/>
            <Tabs initialValue="1">
              <Tabs.Item label="Validators" value="1">
                <Table
                  data={(() => {
                    const ret = [];
                    (pool.registered || []).map((address) => {
                      ret.push({
                        address: address,
                        stake: (pool.vault[address] || 0).toString() + " $KYVE",
                      });
                    });
                    return ret;
                  })()}
                >
                  <Table.Column prop="address" label="Address"/>
                  <Table.Column prop="stake" label="Stake"/>
                </Table>
              </Tabs.Item>
              <Tabs.Item label="Vault" value="2">
                <Table
                  data={(() => {
                    const ret = [];
                    (Object.keys(pool.vault || {}) || []).map((address) => {
                      ret.push({
                        address: address,
                        stake: (pool.vault[address] || 0).toString() + " $KYVE",
                      });
                    });
                    return ret;
                  })()}
                >
                  <Table.Column prop="address" label="Address"/>
                  <Table.Column prop="stake" label="Locked"/>
                </Table>
              </Tabs.Item>
            </Tabs>
          </>
        )}
        <Footer height={height}/>
      </Page>
      <FundPoolModal pool={poolID} ref={fundPoolModal}/>
      <LockTokensModal pool={poolID} ref={lockTokensModal}/>
    </>
  );
};

export default Pool;
