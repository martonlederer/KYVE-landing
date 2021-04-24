import {
  Input,
  Modal,
  Textarea,
  useInput,
  useModal,
  Text,
  Select,
  useToasts,
} from "@geist-ui/react";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

import { interactWrite } from "smartweave";

import { arweave } from "../../../extensions";
import { CONTRACT as CONTRACT_ID } from "@kyve/logic";

const UpdatePoolModal = forwardRef((props: any, ref) => {
  const { setVisible, bindings } = useModal();

  const [loading, setLoading] = useState(false);

  const [toasts, setToast] = useToasts();

  const pool = props.pool;
  // declare inputs
  const {
    state: poolName,
    bindings: bindingsPool,
    setState: setName,
  } = useInput(pool.name);
  const { state: architecture, setState: setArchitecture } = useInput(
    pool.architecture
  );
  const {
    state: config,
    bindings: bindingsConfig,
    setState: setConfig,
  } = useInput(JSON.stringify(pool.config));
  const {
    state: bundleSize,
    bindings: bindingsBundleSize,
    setState: setBundleSize,
  } = useInput(pool.bundleSize);
  const {
    state: uploader,
    bindings: bindingsUploader,
    setState: setUploader,
  } = useInput(pool.uploader);
  const {
    state: uploaderRate,
    bindings: bindingsUploaderRate,
    setState: setUploaderRate,
  } = useInput(pool.rates?.uploader);
  const {
    state: validatorRate,
    bindings: bindingsValidatorRate,
    setState: setValidatorSate,
  } = useInput(pool.rates?.validator);

  useEffect(() => {
    const pool = props.pool;

    if (pool) {
      setName(pool.name);
      setArchitecture(pool.architecture);
      setConfig(JSON.stringify(pool.config, null, 2));
      setBundleSize(pool.bundleSize);
      setUploader(pool.uploader);
      setUploaderRate(pool.rates?.uploader || "0");
      setValidatorSate(pool.rates?.validator || "0");
    }
  }, [JSON.stringify(props.pool)]);

  const updatePool = async () => {
    const input = {
      function: "propose",
      type: "updatePool",
      id: props.poolID,
      pool: {
        name: poolName,
        architecture: architecture,
        config: JSON.parse(config),
        bundleSize: parseInt(bundleSize),
        uploader: uploader,
        rates: {
          uploader: uploaderRate,
          validator: validatorRate,
        },
      },
    };
    console.log(input);
    const state = await interactWrite(arweave, undefined, CONTRACT_ID, input);
    console.log(state);
    setToast({ text: "Vote successfully proposed", type: "success" });
  };

  useImperativeHandle(ref, () => ({
    open() {
      setVisible(true);
    },
  }));

  return (
    <>
      <Modal {...bindings}>
        <Modal.Title>Update Pool</Modal.Title>
        <Modal.Content>
          <Text>Poolname</Text>
          <Input {...bindingsPool} width={"100%"} />
          <Text>Architecture</Text>
          <Select
            placeholder="Architecture"
            initialValue={architecture}
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
          </Select>
          <Text>Config</Text>
          <Textarea {...bindingsConfig} width={"100%"} />
          <Text>Bundle size</Text>
          <Input {...bindingsBundleSize} width={"100%"} />
          <Text>Uploader</Text>
          <Input {...bindingsUploader} width={"100%"} />
          <Text>Uploader rate</Text>
          <Input {...bindingsUploaderRate} width={"100%"} />
          <Text>Validator rate</Text>
          <Input {...bindingsValidatorRate} width={"100%"} />
        </Modal.Content>
        <Modal.Action passive onClick={() => setVisible(false)}>
          Cancel
        </Modal.Action>
        <Modal.Action
          loading={loading}
          onClick={async () => {
            setLoading(true);
            await updatePool();
            setLoading(false);
            setVisible(false);
          }}
        >
          Propose Vote
        </Modal.Action>
      </Modal>
    </>
  );
});

export default UpdatePoolModal;
