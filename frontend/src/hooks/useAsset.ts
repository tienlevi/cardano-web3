import {
  mConStr0,
  MeshTxBuilder,
  resolveDataHash,
  serializePlutusScript,
  stringToHex,
} from "@meshsdk/core";
import { useMutation } from "@tanstack/react-query";
import type { PlutusScript, UTxO } from "@meshsdk/core";
import { useWallet } from "@meshsdk/react";
import plutusScript from "../data/plutus.json";
import useUser from "./useUser";
import { provider } from "../utils/provider";
import { useState } from "react";

const script: PlutusScript = {
  code: plutusScript.validators[0].compiledCode,
  version: "V3",
};

export function lockAsset() {
  const { wallet } = useWallet();
  const [dataHash, setDataHash] = useState<string>("");
  const { address, utxos, asset } = useUser();
  const { address: scriptAddress } = serializePlutusScript(script);
  const txBuilder = new MeshTxBuilder({
    fetcher: provider,
    verbose: true,
  });
  const { mutate: handleLockAsset, ...rest } = useMutation({
    mutationKey: ["/lockAsset"],
    mutationFn: async (data: any) => {
      const unsignedTx = await txBuilder
        .txOut(scriptAddress, [
          {
            unit: "d68ddaf25a80b74aefd4ece2741b6189b97a9c29d462b492d6369ebfe240e289",
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

  return { handleLockAsset, dataHash, ...rest };
}

export function unlockAsset() {
  const { wallet } = useWallet();
  const { address, collateral, utxos } = useUser();
  const txBuilder = new MeshTxBuilder({
    fetcher: provider,
    verbose: true,
  });
  console.log(utxos);

  const getAssetUtxo = async (scriptAddress: any, datum: any) => {
    const utxos = await provider.fetchAddressUTxOs(scriptAddress);
    const dataHash = resolveDataHash(datum);

    const utxo = utxos.find((u) => u.output.dataHash === dataHash);
    return utxo;
  };

  return useMutation({
    mutationKey: ["/"],
    mutationFn: async () => {
      try {
        const utxo = await getAssetUtxo(address, "Hello world");
        const unsignedTx = await txBuilder
          .spendingPlutusScriptV3()
          .txIn(
            utxos?.[0]?.input?.txHash!,
            utxos?.[0]?.input?.outputIndex!,
            utxos?.[0]?.output?.amount!,
            utxos?.[0]?.output?.address!
          )
          .txInInlineDatumPresent()
          .txInScript(script.code)
          .txInDatumValue(mConStr0([stringToHex("Hello world")]))
          .txInRedeemerValue(mConStr0([utxos?.[0]?.input?.txHash!]))
          .changeAddress(address!)
          .txInCollateral(
            collateral?.[0]?.input.txHash!,
            collateral?.[0]?.input.outputIndex!,
            collateral?.[0]?.output.amount!,
            collateral?.[0]?.output.address!
          )
          .selectUtxosFrom(utxos!)
          .complete();
        const signedTx = await wallet.signTx(unsignedTx, true);
        const txHash = await wallet.submitTx(signedTx);
        console.log(txHash);
        return txHash;
      } catch (error) {
        console.log(error);
      }
    },
  });
}
