import {
  mConStr0,
  MeshTxBuilder,
  resolveDataHash,
  serializePlutusScript,
} from "@meshsdk/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { PlutusScript } from "@meshsdk/core";
import { useWallet } from "@meshsdk/react";
import plutusScript from "@/data/plutus.json";
import useUser from "./useUser";
import { provider } from "@/utils/provider";
import { useState } from "react";
import { getTransactionUtxos } from "@/services/transaction";
import { TransactionUTXO } from "@/interface/utxo";

const script: PlutusScript = {
  code: plutusScript.validators[0].compiledCode,
  version: "V3",
};
const { address: scriptAddress } = serializePlutusScript(script);

function useAsset() {
  const { wallet } = useWallet();
  const [dataHash, setDataHash] = useState<string>("");
  const { address, utxos } = useUser();
  const txBuilder = new MeshTxBuilder({
    fetcher: provider,
    verbose: true,
  });
  const hash =
    "ba5927c81f0908012224d3598c6f36038b6beaabf8c94e7f2ad8e86e3a74a5e5";

  const { data: utxo } = useQuery<TransactionUTXO>({
    queryKey: [`/txs/${hash}/utxos`],
    queryFn: async () => {
      const utxos = await getTransactionUtxos(hash);
      const dataHashs = resolveDataHash(dataHash);

      const utxo = utxos.outputs.find((u: any) => u.data_hash === dataHashs);

      return utxo;
    },
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
        .txOutDatumHashValue(mConStr0([plutusScript.validators[0].hash]))
        .changeAddress(address!)
        .selectUtxosFrom(utxos!)
        .complete();

      const signedTx = await wallet.signTx(unsignedTx);
      const txHash = await wallet.submitTx(signedTx);
      setDataHash(txHash);
    },
  });

  console.log(utxo);

  const { mutate: handleUnlockAsset, isPending: loadingUnlockAsset } =
    useMutation({
      mutationKey: ["/unlockAsset"],
      mutationFn: async () => {
        try {
          const txHash = utxo?.inputs?.[0].tx_hash;
          const outputIndex = utxo?.inputs?.[0].output_index;

          const unsignedTx = await txBuilder
            .spendingPlutusScriptV3()
            .txIn(txHash!, outputIndex!)
            .txInInlineDatumPresent()
            .spendingTxInReference(txHash!, outputIndex!)
            .txInDatumValue(mConStr0([]))
            .txInRedeemerValue(mConStr0([]))
            .changeAddress(address!)
            .selectUtxosFrom(utxos!)
            .complete();
          const signedTx = await wallet.signTx(unsignedTx, true);
          const submittedTxHash = await wallet.submitTx(signedTx);
          console.log("Transaction submitted:", submittedTxHash);
          return submittedTxHash;
        } catch (error) {
          console.log(error);
        }
      },
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
