import {
  Button,
  Checkbox,
  Code,
  Divider,
  Input,
  Link,
  Note,
  Page,
  Row,
  Spacer,
  Text,
  Tooltip,
  useInput,
} from "@geist-ui/react";
import { Twitter } from "@icons-pack/react-simple-icons";
import { InfoIcon } from "@primer/octicons-react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import Nav from "../components/Nav";
import { arweave } from "../extensions";
import useConnected from "../hooks/useConnected";
import parse from "twitter-url-parser";
import Footer from "../components/Footer";

const Faucet = () => {
  const connected = useConnected();
  const [address, setAddress] = useState("");
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const tweet = useInput("");

  useEffect(() => {
    if (connected) {
      arweave.wallets.getAddress().then((address) => setAddress(address));
    }
  }, [connected]);

  const { data } = useSWR(
    `https://api.kyve.network/faucet?address=${address}`,
    async (url: string) => {
      const res = await fetch(url);
      return await res.json();
    }
  );

  return (
    <>
      <Nav />
      <Page>
        {data ? (
          <div
            style={{
              position: "absolute",
              top: "35%",
              left: "50%",
              transform: "translateX(-50%) translateY(-35%)",
            }}
          >
            <Text h3 type="secondary">
              You've claimed your tokens!
            </Text>
            <Spacer y={1} />
            {data.transaction && data.replyID ? (
              <>
                <Note type="warning">
                  The transaction might take ~20 minutes to mine.
                </Note>
                <Text>
                  Transaction:{" "}
                  <Link
                    href={`https://viewblock.io/arweave/tx/${data.transaction}`}
                    target="_blank"
                  >
                    <Code>{data.transaction}</Code>
                  </Link>
                </Text>
                <Text>
                  We also replied to your tweet{" "}
                  <Link
                    href={`https://twitter.com/kyveFaucet/status/${data.replyID}`}
                    target="_blank"
                    color={true}
                  >
                    here
                  </Link>{" "}
                  :)
                </Text>
              </>
            ) : (
              <>
                <Text>Our server is currently handling your request.</Text>
                <Text>This page is automatically refreshed.</Text>
              </>
            )}
          </div>
        ) : (
          <div
            style={{
              position: "absolute",
              top: "35%",
              left: "50%",
              transform: "translateX(-50%) translateY(-35%)",
            }}
          >
            <Text h3 type="secondary" style={{ textAlign: "center" }}>
              Claim your free 1000 $KYVE!
            </Text>
            <Spacer y={1} />
            {checked ? (
              <Row align="middle">
                <Input
                  {...tweet.bindings}
                  width="100%"
                  size="large"
                  status="success"
                />
                <Spacer x={0.5} />
                <Tooltip text="Please paste in your tweet URL.">
                  <InfoIcon />
                </Tooltip>
              </Row>
            ) : (
              <Button
                icon={<Twitter />}
                type="success-light"
                onClick={() => {
                  window.open(
                    "https://twitter.com/intent/tweet?text=" +
                      `I'm claiming my free tokens for the @KYVENetwork testnet. 🚀%0A%0A${address}`
                  );
                }}
                style={{ width: "100%" }}
                disabled={!connected}
              >
                Tweet now
              </Button>
            )}
            <Row align="middle">
              <Checkbox
                size="large"
                checked={checked}
                onChange={({ target }) => setChecked(target.checked)}
                disabled={!connected}
              />
              <Text>I have sent the tweet.</Text>
            </Row>
            <Divider />
            <Button
              type="secondary"
              onClick={async () => {
                setLoading(true);
                await fetch(
                  `https://api.kyve.network/faucet?address=${address}&tweetID=${
                    parse(tweet.state).id
                  }`,
                  {
                    method: "POST",
                  }
                );
              }}
              style={{ width: "100%" }}
              disabled={!checked || !parse(tweet.state)}
              loading={loading}
            >
              {connected ? "Claim!" : "Connect your wallet"}
            </Button>
          </div>
        )}
      </Page>
      <Footer />
    </>
  );
};

export default Faucet;
