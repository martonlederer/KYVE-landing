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
import { contract } from "../../../extensions";
import { useEffect, useState } from "react";
import Highlight from "react-highlight";
import useConnected from "../../../hooks/useConnected";
import { motion } from "framer-motion";

const VotesGrid = (props: { id: number; votes: any[]; height: number }) => {
  const [loading, setLoading] = useState(false);
  const [, setToast] = useToasts();

  const [myAddress, setMyAddress] = useState("");
  const connected = useConnected();

  useEffect(() => {
    if (connected) {
      // @ts-ignore
      window.arweaveWallet.getActiveAddress().then((address) => {
        setMyAddress(address);
      });
    }
  }, [connected]);

  const voteOn = async (id: number, cast: "yay" | "nay") => {
    const txID = await contract.vote(id, cast);
    console.log(txID);
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
      const txID = await contract.finalize(id);
      console.log(txID);
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

  const votes = [];
  for (let i = 0; i < props.votes.length; i++) {
    if (props.votes[i].metadata.id === props.id) {
      votes.push({ ...props.votes[i], id: i });
    }
  }
  votes.reverse();

  return (
    <>
      <Grid.Container gap={2}>
        {votes.map((vote, id) => (
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
                  {vote.id}:
                  <Code style={{ marginLeft: ".33em" }}>{vote.type}</Code>
                </Text>
                <Text>
                  <Highlight className="json">
                    {JSON.stringify(vote.metadata, null, 2)}
                  </Highlight>
                </Text>
                <Progress
                  value={props.height - vote.start}
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
                    {props.height >= vote.end ? (
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
        ))}
      </Grid.Container>
    </>
  );
};

export default VotesGrid;
