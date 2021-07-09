import {
  Input,
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
  const { state: config, bindings: bindingsConfig } = useInput("{}");

  const { state: name, bindings: bindingsName } = useInput("");
  const { state: uploader, bindings: bindingsUploader } = useInput("3dX8Cnz3N64nKt2EKmWpKL1EbErFP3RFjxSDyQHQrkI");
  const { state: bundleSize, bindings: bindingsBundleSize } = useInput("50");
  const { state: gracePeriod, bindings: bindingsGracePeriod } = useInput("20");
  const { state: slashThreshold, bindings: bindingsSlashThreshold } = useInput("20");
  const { state: admins, bindings: bindingsAdmins } = useInput("[]");
  const { state: logo, bindings: bindingsLogo } = useInput("");
  const { state: runtime, bindings: bindingsRuntime } = useInput("");
  //const { state: payout, bindings: bindingsPayout } = useInput("{payout: {kyvePerByte: 0.0002 idleCost: 0}");
  const payout = {
    "kyvePerByte": 0.0002,
    "idleCost": 0
  }

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
          <Input {...bindingsName} width={"100%"}>
            Name
          </Input>
          <Input {...bindingsLogo} width={"100%"}>
            Logo (optional)
          </Input>
          <Input {...bindingsRuntime} width={"100%"}>
            Runtime
          </Input>
          <Input {...bindingsUploader} width={"100%"}>
            Uploader
          </Input>
          <Input {...bindingsBundleSize} width={"100%"}>
            Bundlesize
          </Input>
          <Input {...bindingsGracePeriod} width={"100%"}>
            Grace period
          </Input>
          <Input {...bindingsSlashThreshold} width={"100%"}>
            Slash threshold
          </Input>
          <Text>Admins</Text>
          <Textarea {...bindingsAdmins} width={"100%"} />
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
              settings: {
                name,
                runtime,
                version: "0.0.1",
                logo,
                foriegnContracts: {
                  governance: "C_1uo08qRuQAeDi9Y1I8fkaWYUC9IWkOrKDNe9EphJo",
                  treasury: "RCH2pVk8m-IAuwg36mwxUt8Em_CnpWjSLpiAcCvZJMA"
                },
                paused: false,
                admins: JSON.parse(admins),
                uploader,
                bundleSize: parseInt(bundleSize),
                gracePeriod: parseInt(gracePeriod),
                slashThreshold: parseInt(slashThreshold),
                payout
              },
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
