import {
  Input,
  Modal,
  Spacer,
  useInput,
  useModal,
  useToasts,
} from "@geist-ui/react";
import { forwardRef, useImperativeHandle, useState } from "react";

import { contract } from "../../../extensions";

const TransferTokenModal = forwardRef((props, ref) => {
  const { setVisible, bindings } = useModal();

  const [loading, setLoading] = useState(false);

  const [toasts, setToast] = useToasts();

  // declare inputs
  const { state: target, bindings: bindingsTarget } = useInput("");
  const { state: quantity, bindings: bindingsQuantity } = useInput("");

  const transfer = async () => {
    const txID = await contract.transfer(target, parseInt(quantity));
    console.log(txID);
    setToast({ text: "Successfully transferred", type: "success" });
  };

  useImperativeHandle(ref, () => ({
    open() {
      setVisible(true);
    },
  }));

  return (
    <>
      <Modal {...bindings}>
        <Modal.Title>Transfer Tokens</Modal.Title>
        <Modal.Content>
          <Input
            {...bindingsTarget}
            width={"100%"}
            placeholder="Enter target address..."
          >
            Target
          </Input>
          <Spacer y={1} />
          <Input
            {...bindingsQuantity}
            width={"100%"}
            placeholder="Enter token quantity..."
            labelRight="$KYVE"
          >
            Quantity
          </Input>
        </Modal.Content>
        <Modal.Action passive onClick={() => setVisible(false)}>
          Cancel
        </Modal.Action>
        <Modal.Action
          loading={loading}
          onClick={async () => {
            setLoading(true);
            await transfer();
            setLoading(false);
            setVisible(false);
          }}
        >
          Transfer
        </Modal.Action>
      </Modal>
    </>
  );
});

export default TransferTokenModal;
