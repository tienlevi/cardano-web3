import {
  deserializeAddress,
  mConStr0,
  MeshTxBuilder,
  serializePlutusScript,
} from "@meshsdk/core";
import { useMutation } from "@tanstack/react-query";
import type { PlutusScript } from "@meshsdk/core";
import { useWallet } from "@meshsdk/react";
import plutusScript from "@/data/plutus.json";
import useUser from "./useUser";
import { provider } from "@/utils/provider";
import { useState } from "react";
import { toast } from "react-toastify";

const script: PlutusScript = {
  code: plutusScript.validators[0].compiledCode,
  version: "V3",
};
const { address: scriptAddress } = serializePlutusScript(script);

function useAsset() {
  const { wallet } = useWallet();
  const [dataHash, setDataHash] = useState<string>("");
  const { address, utxos, collateral } = useUser();
  const txBuilder = new MeshTxBuilder({
    fetcher: provider,
    submitter: provider,
    verbose: true,
  });

  const { mutate: handleLockAsset, isPending: loadingLockAsset } = useMutation({
    mutationKey: ["/lockAsset"],
    mutationFn: async (data: any) => {
      const unsignedTx = await txBuilder
        .txOut(scriptAddress, [
          {
            unit: "lovelace",
            quantity: data.quantity,
          },
        ])
        .txOutInlineDatumValue(plutusScript.validators[0].hash)
        .txOutDatumHashValue(mConStr0([plutusScript.validators[0].hash]))
        .changeAddress(address!)
        .selectUtxosFrom(utxos!)
        .complete();
      toast.success("Lock success");
      const signedTx = await wallet.signTx(unsignedTx);
      const txHash = await wallet.submitTx(signedTx);
      setDataHash(txHash);
    },
  });

  async function getUtxoByTxHash(txHash: string) {
    const utxos = await provider.fetchUTxOs(txHash);
    if (utxos.length === 0) {
      throw new Error("UTxO not found");
    }
    return utxos[0];
  }

  const { mutate: handleUnlockAsset, isPending: loadingUnlockAsset } =
    useMutation({
      mutationKey: ["/unlockAsset"],
      mutationFn: async () => {
        const signerHash = deserializeAddress(address!).pubKeyHash;
        const scriptUtxo = await getUtxoByTxHash(
          "5f20feff9cf52a14ff41506b9fdac4e44da1c9edb6faaaeee0da0e0eecd268ee"
        );
        const txBuilderInstance = txBuilder
          .setNetwork("preview")
          .spendingPlutusScriptV3()
          .txIn(
            scriptUtxo.input.txHash,
            scriptUtxo.input.outputIndex,
            scriptUtxo.output.amount,
            scriptUtxo.output.address
          )
          .txInScript(script.code)
          .txInRedeemerValue({ alternative: 0, fields: ["Hello world"] })
          .txInInlineDatumPresent()
          .txInDatumValue(mConStr0([plutusScript.validators[0].hash]))
          .requiredSignerHash(signerHash)
          .changeAddress(address!)
          .txInCollateral(
            collateral?.[0].input.txHash!,
            collateral?.[0].input.outputIndex!,
            collateral?.[0].output.amount,
            collateral?.[0].output.address
          )
          .selectUtxosFrom(utxos!);
        const unsignedTx = await txBuilderInstance.complete();
        const signedTx = await wallet.signTx(unsignedTx, true);
        const txHash = await wallet.submitTx(signedTx);
        toast.success("Unlock success");
        console.log("Unlock Tx Hash:", txHash);
        return txHash;
      },
      onError: (error) => console.log(error),
    });

  return {
    handleLockAsset,
    handleUnlockAsset,
    loadingLockAsset,
    loadingUnlockAsset,
    dataHash,
  };
}

export default useAsset;
