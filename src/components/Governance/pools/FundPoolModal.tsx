import { Input, Modal, useInput, useModal, useToasts } from "@geist-ui/react";
import { forwardRef, useImperativeHandle, useState } from "react";

import { interactWrite } from "smartweave";

import { arweave } from "../../../extensions";
import { CONTRACT as CONTRACT_ID } from "@kyve/logic";

const FundPoolModal = forwardRef((props: any, ref) => {
  const { setVisible, bindings } = useModal();

  const [loading, setLoading] = useState(false);

  const [toasts, setToast] = useToasts();

  const { state: quantity, bindings: bindingsQuantity } = useInput("1");

  const fundPool = async () => {
    const input = {
      function: "fund",
      id: props.pool,
      qty: parseInt(quantity),
    };
    console.log(input);
    const state = await interactWrite(arweave, undefined, CONTRACT_ID, input);
    console.log(state);
    setToast({ text: "Pool successfully funded", type: "success" });
  };

  useImperativeHandle(ref, () => ({
    open() {
      setVisible(true);
    },
  }));

  return (
    <>
      <Modal {...bindings}>
        <Modal.Title>Fund Pool</Modal.Title>
        <Modal.Content>
          <Input {...bindingsQuantity} width={"100%"}>
            Amount
          </Input>
        </Modal.Content>
        <Modal.Action passive onClick={() => setVisible(false)}>
          Cancel
        </Modal.Action>
        <Modal.Action
          loading={loading}
          onClick={async () => {
            setLoading(true);
            await fundPool();
            setLoading(false);
            setVisible(false);
          }}
        >
          Fund Pool
        </Modal.Action>
      </Modal>
    </>
  );
});

export default FundPoolModal;
