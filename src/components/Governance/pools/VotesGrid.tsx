import {
  Button,
  ButtonGroup,
  Card,
  Grid,
  Text,
  useToasts,
} from "@geist-ui/react";
import { interactWrite } from "smartweave";
import { arweave } from "../../../extensions";
import { CONTRACT as CONTRACT_ID } from "@kyve/logic";
import { useEffect, useState } from "react";
import useConnected from "../../../hooks/useConnected";
import useContract from "../../../hooks/useContract";

const VotesGrid = (props) => {
  const [loading, setLoading] = useState(false);
  const [toasts, setToast] = useToasts();

  const [myAddress, setMyAddress] = useState("");
  const connected = useConnected();

  const { loading: contractLoading, state, height } = useContract();

  useEffect(() => {
    if (connected) {
      // @ts-ignore
      window.arweaveWallet.getActiveAddress().then((address) => {
        setMyAddress(address);
      });
    }
  }, [connected]);

  const voteOn = async (id: number, cast: "yay" | "nay") => {
    const input = {
      function: "vote",
      id,
      cast,
    };

    console.log(input);
    const state = await interactWrite(arweave, undefined, CONTRACT_ID, input);
    console.log(state);
    setToast({ text: `Successfully voted with ${cast}`, type: "success" });
  };

  const hasVoted = (address, vote) => {
    console.log(vote);
    const yays = Object.keys(vote.yays);
    const nays = Object.keys(vote.nays);
    if (yays.includes(address)) {
      return {
        voted: true,
        cast: "yay",
      };
    } else if (nays.includes(address)) {
      return {
        voted: true,
        cast: "nay",
      };
    } else {
      return {
        voted: false,
        cast: undefined,
      };
    }
  };

  return (
    <>
      <Grid.Container gap={2}>
        {props.votes.map((vote, id) => {
          if (vote.metadata.id === props.poolID) {
            return (
              <Grid>
                <Card>
                  <Text h4>{vote.type}</Text>
                  <Text>
                    <pre>{JSON.stringify(vote.metadata, null, 2)}</pre>
                  </Text>
                  {height >= vote.end ? (
                    "Finalized"
                  ) : (
                    <>
                      {hasVoted(myAddress, vote).voted ? (
                        <>
                          <Text>
                            Already voted with {hasVoted(myAddress, vote).cast}
                          </Text>
                        </>
                      ) : (
                        <ButtonGroup ghost disabled={loading}>
                          <Button
                            loading={loading}
                            onClick={async () => {
                              setLoading(true);
                              await voteOn(id, "nay");
                              setLoading(false);
                            }}
                          >
                            Nay
                          </Button>
                          <Button
                            loading={loading}
                            onClick={async () => {
                              setLoading(true);
                              await voteOn(id, "yay");
                              setLoading(false);
                            }}
                          >
                            Yay
                          </Button>
                        </ButtonGroup>
                      )}
                    </>
                  )}
                </Card>
              </Grid>
            );
          }
        })}
      </Grid.Container>
    </>
  );
};

export default VotesGrid;
