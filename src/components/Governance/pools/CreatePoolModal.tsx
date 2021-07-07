import {
  Modal,
  Text,
  Textarea,
  useInput,
  useModal,
  useToasts,
} from "@geist-ui/react";
import { forwardRef, useImperativeHandle, useState } from "react";

import { arweave } from "../../../extensions";
import { Pool } from "@kyve/contract-lib";

const CreatePoolModal = forwardRef((props, ref) => {
  const { setVisible, bindings } = useModal();
  const [loading, setLoading] = useState(false);
  const [toasts, setToast] = useToasts();
  const { state: settings, bindings: bindingsSettings } = useInput("{}");
  const { state: config, bindings: bindingsConfig } = useInput("{}");

  useImperativeHandle(ref, () => ({
    open() {
      setVisible(true);
    },
  }));

  const pool = new Pool(arweave, "use_wallet");

  return (
    <>
      <Modal {...bindings}>
        <Modal.Title>Create Pool</Modal.Title>
        <Modal.Content>
          <Text>Settings</Text>
          <Textarea {...bindingsSettings} width={"100%"} />
          <Text>Config</Text>
          <Textarea {...bindingsConfig} width={"100%"} />
        </Modal.Content>
        <Modal.Action passive onClick={() => setVisible(false)}>
          Cancel
        </Modal.Action>
        <Modal.Action
          loading={loading}
          onClick={async () => {
            setLoading(true);
            await pool.create({
              settings: JSON.parse(settings),
              config: JSON.parse(config),
              credit: {},
              txs: {},
              invocations: [],
              foreignCalls: [],
            });
            setLoading(false);
            setVisible(false);
            setToast({ text: "Pool successfully created.", type: "success" });
          }}
        >
          Create
        </Modal.Action>
      </Modal>
    </>
  );
});

export default CreatePoolModal;
