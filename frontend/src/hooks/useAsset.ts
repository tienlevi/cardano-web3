import {
  mConStr0,
  MeshTxBuilder,
  resolveDataHash,
  serializePlutusScript,
} from "@meshsdk/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { PlutusScript } from "@meshsdk/core";
import { useWallet } from "@meshsdk/react";
import plutusScript from "../data/plutus.json";
import useUser from "./useUser";
import { provider } from "../utils/provider";

export function lockAsset() {
  const { wallet } = useWallet();
  const { address, utxos } = useUser();
  const script: PlutusScript = {
    code: plutusScript.validators[3].compiledCode,
    version: "V2",
  };
  const { address: scriptAddress } = serializePlutusScript(script);
  const txBuilder = new MeshTxBuilder({
    fetcher: provider,
    verbose: true,
  });

  return useMutation({
    mutationKey: ["/lockAsset"],
    mutationFn: async (data: any) => {
      const unsignedTx = await txBuilder
        .txOut(scriptAddress, [
          {
            unit: "lovelace",
            quantity: data.quantity,
          },
        ])
        .txOutDatumHashValue(
          mConStr0(["54024b74df12e1640911614896981b29eebd22c14e0745e382b05cba"])
        )
        .changeAddress(address!)
        .selectUtxosFrom(utxos!)
        .complete();

      const signedTx = await wallet.signTx(unsignedTx);
      const txHash = await wallet.submitTx(signedTx);
      console.log(txHash);
      return txHash;
    },
  });
}

export function unlockAsset() {
  const { wallet } = useWallet();
  const { address, collateral, utxos } = useUser();
  const script: PlutusScript = {
    code: plutusScript.validators[3].compiledCode,
    version: "V2",
  };
  const { address: scriptAddress } = serializePlutusScript(script);

  const txBuilder = new MeshTxBuilder({
    fetcher: provider,
    verbose: true,
  });

  return useMutation({
    mutationKey: ["/"],
    mutationFn: async () => {
      try {
        const unsignedTx = await txBuilder
          .spendingPlutusScriptV2()
          .txIn(utxos?.[0]?.input?.txHash!, utxos?.[0]?.input?.outputIndex!)
          .txInInlineDatumPresent()
          .txInScript(script.code)
          .txInRedeemerValue(mConStr0([]))
          .changeAddress(address!)
          .txInCollateral(
            collateral?.[0]?.input.txHash!,
            collateral?.[0]?.input.outputIndex!,
            collateral?.[0]?.output.amount!,
            collateral?.[0]?.output.address!
          )
          .selectUtxosFrom(utxos!)
          .complete();
        const signedTx = await wallet.signTx(unsignedTx);
        const txHash = await wallet.submitTx(signedTx);
        return txHash;
      } catch (error) {
        console.log(error);
      }
    },
  });
}
