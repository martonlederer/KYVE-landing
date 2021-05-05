import {
  Input,
  Modal,
  Select,
  Text,
  Textarea,
  useInput,
  useModal,
  useToasts,
} from "@geist-ui/react";
import { forwardRef, useImperativeHandle, useState } from "react";

import { contract } from "../../../extensions";

const CreatePoolModal = forwardRef((props, ref) => {
  const { setVisible, bindings } = useModal();

  const [loading, setLoading] = useState(false);

  const [toasts, setToast] = useToasts();

  // declare inputs
  const { state: pool, bindings: bindingsPool } = useInput("");
  const { state: architecture, setState: setArchitecture } = useInput(
    "Avalanche"
  );
  const { state: config, bindings: bindingsConfig } = useInput("{}");

  const createPool = async () => {
    const txID = await contract.createPool(
      pool,
      architecture,
      JSON.parse(config)
    );
    console.log(txID);
    setToast({ text: "Pool successfully created", type: "success" });
  };

  useImperativeHandle(ref, () => ({
    open() {
      setVisible(true);
    },
  }));

  return (
    <>
      <Modal {...bindings}>
        <Modal.Title>Create Pool</Modal.Title>
        <Modal.Content>
          <Input
            {...bindingsPool}
            width={"100%"}
            placeholder="Enter pool name..."
          >
            Poolname
          </Input>
          <Text>Architecture</Text>
          <Select
            placeholder="Architecture"
            width={"100%"}
            onChange={(value) => {
              // @ts-ignore
              setArchitecture(value);
            }}
          >
            <Select.Option value="Avalanche">Avalanche</Select.Option>
            <Select.Option value="Cosmos">Cosmos</Select.Option>
            <Select.Option value="Polkadot">Polkadot</Select.Option>
            <Select.Option value="Solana">Solana</Select.Option>
            <Select.Option value="SmartWeave">SmartWeave</Select.Option>
            <Select.Option value="Zilliqa">Zilliqa</Select.Option>
          </Select>
          <Text>Config</Text>
          <Textarea {...bindingsConfig} width={"100%"} />
          {/*
          <Input {...bindingsBundleSize} width={"100%"}>
            Bundle size
          </Input>
          <Input {...bindingsUploader} width={"100%"} disabled={true}>
            Uploader
          </Input>
          <Input {...bindingsArchiveRate} width={"100%"}>
            Archive rate
          </Input>
          <Input {...bindingsValidatorRate} width={"100%"}>
            Validator rate
          </Input>
          */}
        </Modal.Content>
        <Modal.Action passive onClick={() => setVisible(false)}>
          Cancel
        </Modal.Action>
        <Modal.Action
          loading={loading}
          onClick={async () => {
            setLoading(true);
            await createPool();
            setLoading(false);
            setVisible(false);
          }}
        >
          Create Pool
        </Modal.Action>
      </Modal>
    </>
  );
});

export default CreatePoolModal;
