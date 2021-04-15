import useContract from "../../../hooks/useContract";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Page, Text, Table, Dot, Grid, Card, Tabs, Spacer} from "@geist-ui/react";

const Pool = () => {
  const router = useRouter();
  const [pool, setPool] = useState({});
  const {loading, state, height} = useContract();

  const poolID = parseInt(router.query.poolId as string);

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
    )
  }

  return (
    <>
      <Page>
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
                <DisplayCard headline="Status" text={pool.balance > 0 ? <Dot type="success">Active</Dot> :
                  <Dot type="error">Insufficient balance</Dot>}/>
              </Grid>
            </Grid.Container>
            <Spacer y={2}/>
            <Tabs initialValue="1">
              <Tabs.Item label="Validators" value="1">
                <Table
                  data={(() => {
                    const ret = [];
                    (pool.registered || []).map((address) => {
                      ret.push({address: address, stake: (pool.vault[address] || 0).toString() + " $KYVE"});
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
                    (Object.keys(pool.vault) || []).map((address) => {
                      ret.push({address: address, stake: (pool.vault[address] || 0).toString() + " $KYVE"});
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
      </Page>
    </>
  );
};

export default Pool;
