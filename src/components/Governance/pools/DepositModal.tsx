import { Input, Modal, useInput, useModal, useToasts } from "@geist-ui/react";
import { forwardRef, useImperativeHandle, useState } from "react";

import { arweave } from "../../../extensions";
import { Pool } from "@kyve/contract-lib";

const DepositModal = forwardRef((props: { pool: string }, ref) => {
  const { setVisible, bindings } = useModal();
  const [loading, setLoading] = useState(false);
  const [toasts, setToast] = useToasts();
  const { state: quantity, bindings: bindingsQuantity } = useInput("1");

  useImperativeHandle(ref, () => ({
    open() {
      setVisible(true);
    },
  }));

  const pool = new Pool(arweave, "use_wallet", props.pool);

  return (
    <>
      <Modal {...bindings}>
        <Modal.Title>Deposit into Pool</Modal.Title>
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
            await pool.deposit(+quantity);
            setLoading(false);
            setVisible(false);
            setToast({ text: "Successful deposit", type: "success" });
          }}
        >
          Deposit
        </Modal.Action>
      </Modal>
    </>
  );
});

export default DepositModal;
