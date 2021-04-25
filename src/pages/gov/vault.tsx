import Arweave from "arweave";
import useConnected from "../../hooks/useConnected";
import useContract from "../../hooks/useContract";
import { useState, useEffect } from "react";
import {
  useModal,
  useInput,
  useToasts,
  Page,
  Spacer,
  Table,
  Text,
  Modal,
  Row,
  Input,
} from "@geist-ui/react";
import { motion } from "framer-motion";
import Button from "../../components/Button";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import tokenStyles from "../../styles/views/tokens.module.sass";

const client = new Arweave({
  host: "arweave.net",
  port: 443,
  protocol: "https",
});

const Vault = () => {
  const connected = useConnected();
  const { loading, state, height } = useContract();

  const [address, setAddress] = useState("");
  useEffect(() => {
    if (connected) {
      // @ts-ignore
      window.arweaveWallet.getActiveAddress().then((address) => {
        setAddress(address);
      });
    }
  }, [connected]);

  const modal = useModal();
  const amount = useInput("0");
  const length = useInput("0");
  const [_, setToast] = useToasts();

  return (
    <>
      <Nav />
      <Page>
        {connected && !loading ? (
          <>
            {address in Object.keys(state.vault || {}) ? (
              state.vault[address].map((entry, i) => (
                <>
                  <motion.div
                    className={"Card " + tokenStyles.Card}
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.23,
                      ease: "easeInOut",
                      delay: i * 0.05,
                    }}
                  >
                    <div
                      className={tokenStyles.Data}
                      style={{ margin: ".6em 0" }}
                    >
                      <p style={{ textAlign: "left" }}>Amount</p>
                      <h1 style={{ textAlign: "left" }}>
                        {entry.amount} $KYVE
                      </h1>
                    </div>
                    <div
                      className={tokenStyles.Data}
                      style={{ margin: ".6em 0", textAlign: "left" }}
                    >
                      <p>Status</p>
                      <h1>
                        {entry.end < height
                          ? "Ended."
                          : `Ends in ${entry.end - height} blocks.`}
                      </h1>
                    </div>
                  </motion.div>
                  <Spacer y={1} />
                </>
              ))
            ) : (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translateX(-50%) translateY(-50%)",
                }}
              >
                <Text h3 type="secondary" style={{ textAlign: "center" }}>
                  You don't have any tokens locked.
                </Text>
                <Spacer y={1} />
                <Button
                  onClick={() => modal.setVisible(true)}
                  style={{ margin: "0 auto" }}
                >
                  Lock Tokens
                </Button>
              </div>
            )}
          </>
        ) : (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translateX(-50%) translateY(-50%)",
            }}
          >
            <Text h3 type="secondary" style={{ textAlign: "center" }}>
              Please connect your wallet.
            </Text>
          </div>
        )}
        {!loading && (
          <Modal {...modal.bindings}>
            <Modal.Title>Lock Tokens</Modal.Title>
            <Modal.Content>
              <Row justify="center">
                <span>
                  <Input
                    {...amount.bindings}
                    type="number"
                    labelRight="$KYVE"
                    min={0}
                    max={
                      address in state.balances ? state.balances[address] : 0
                    }
                    width="100%"
                  />
                  <Spacer y={1} />
                  <Input
                    {...length.bindings}
                    type="number"
                    labelRight="blocks"
                    min={0}
                    width="100%"
                  />
                </span>
              </Row>
            </Modal.Content>
            <Modal.Action passive onClick={() => modal.setVisible(false)}>
              Cancel
            </Modal.Action>
            <Modal.Action
              onClick={async () => {
                const tx = await client.createTransaction({
                  data: Math.random().toString().slice(-4),
                });

                tx.addTag("App-Name", "SmartWeaveAction");
                tx.addTag("App-Version", "0.3.0");
                tx.addTag(
                  "Contract",
                  "z7oP5KYMnPnSqWE81hM1BvewB7bJMwiOJtAl3JIl4_w"
                );
                tx.addTag(
                  "Input",
                  JSON.stringify({
                    function: "lock",
                    qty: amount.state,
                    length: length.state,
                  })
                );

                await client.transactions.sign(tx);
                await client.transactions.post(tx);

                setToast({ text: `Locked. ${tx.id}` });
                modal.setVisible(false);

                amount.reset();
                length.reset();
              }}
            >
              Lock
            </Modal.Action>
          </Modal>
        )}
      </Page>
      <Footer />
    </>
  );
};

export default Vault;
