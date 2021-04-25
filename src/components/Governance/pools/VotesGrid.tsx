import {
  Button,
  ButtonGroup,
  Card,
  Code,
  Grid,
  Progress,
  Text,
  useToasts,
} from "@geist-ui/react";
import { interactWrite } from "smartweave";
import { arweave } from "../../../extensions";
import { CONTRACT as CONTRACT_ID } from "@kyve/logic";
import { useEffect, useState } from "react";
import Highlight from "react-highlight";
import useConnected from "../../../hooks/useConnected";
import useContract from "../../../hooks/useContract";
import { motion } from "framer-motion";

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
    const yays = vote.yays;
    const nays = vote.nays;
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

  const FinalizeButton = (props) => {
    const [loading, setLoading] = useState(false);

    const finalize = async (id: number) => {
      const input = {
        function: "finalize",
        id,
      };

      console.log(input);
      const state = await interactWrite(arweave, undefined, CONTRACT_ID, input);
      console.log(state);
      setToast({ text: `Successfully finalized vote`, type: "success" });
    };

    return (
      <Button
        onClick={async () => {
          setLoading(true);
          await finalize(props.voteID);
          setLoading(false);
        }}
      >
        Finalize
      </Button>
    );
  };

  return (
    <>
      <Grid.Container gap={2}>
        {props.votes.map((vote, id) => {
          if (vote.metadata.id === props.poolID) {
            return (
              <Grid key={id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.23,
                    ease: "easeInOut",
                    delay: id * 0.05,
                  }}
                >
                  <Card className="Card">
                    <Text h4>
                      {id}:
                      <Code style={{ marginLeft: ".33em" }}>{vote.type}</Code>
                    </Text>
                    <Text>
                      <Highlight className="json">
                        {JSON.stringify(vote.metadata, null, 2)}
                      </Highlight>
                    </Text>
                    <Progress
                      value={height - vote.start}
                      max={vote.end - vote.start}
                      colors={{
                        100:
                          (vote.status === "passed" && "#5fe014") ||
                          (vote.status === "errored" && "#ff0000") ||
                          "#F5A623",
                      }}
                    />
                    {vote.status === "passed" ? (
                      <Text>Vote passed</Text>
                    ) : undefined}
                    {vote.status === "errored" ? (
                      <Text>Vote errored</Text>
                    ) : undefined}
                    {vote.status === "pending" ? (
                      <>
                        {height >= vote.end ? (
                          <FinalizeButton voteID={id} />
                        ) : (
                          <>
                            {hasVoted(myAddress, vote).voted ? (
                              <>
                                <Text>
                                  Already voted with{" "}
                                  {hasVoted(myAddress, vote).cast}
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
                      </>
                    ) : undefined}
                  </Card>
                </motion.div>
              </Grid>
            );
          }
        })}
      </Grid.Container>
    </>
  );
};

export default VotesGrid;
