import {
  deserializeAddress,
  MeshTxBuilder,
  serializePlutusScript,
  Transaction,
} from "@meshsdk/core";
import { useMutation } from "@tanstack/react-query";
import type { Data, PlutusScript } from "@meshsdk/core";
import { useWallet } from "@meshsdk/react";
import cbor from "cbor";
import plutusScript from "../data/plutus.json";
import { provider } from "../utils/provider";
import useUser from "./useUser";

export function lockAsset() {
  const { wallet } = useWallet();
  const { address } = useUser();

  const { pubKeyHash: hash } = deserializeAddress(
    address ??
      "addr_test1qrlawvv4580q9vm8eegjz9sgd4msaxzdjpqhelhnjlk73cc0qt2c8lrpldzeqk2khz7qju955hfedm6jf8wsh5kltgmq0fvp29"
  );

  const script: PlutusScript = {
    code: plutusScript.validators[0].compiledCode,
    version: "V2",
  };

  const datum: Data = {
    alternative: 0,
    fields: [hash ?? ""],
  };

  const { address: scriptAddress } = serializePlutusScript(script);
  const tx = new Transaction({ initiator: wallet, verbose: true }).sendLovelace(
    { address: scriptAddress, datum: { value: datum } },
    "1000000"
  );

  return useMutation({
    mutationKey: ["/lockAsset"],
    mutationFn: async () => {
      try {
        const unsignedTx = await tx.build();
        const signedTx = await wallet.signTx(unsignedTx);
        const txHash = await wallet.submitTx(signedTx);
        console.log(txHash);
        return txHash;
      } catch (error) {
        console.log(error);
      }
    },
  });
}

export function unlockAsset() {
  const { wallet } = useWallet();
  const script: PlutusScript = {
    code: cbor
      .encode(Buffer.from(plutusScript.validators[0].compiledCode, "hex"))
      .toString("hex"),
    version: "V2",
  };
  const { address: scriptAddress } = serializePlutusScript(script);
  const tx = new MeshTxBuilder({ fetcher: provider, verbose: true });

  return useMutation({
    mutationKey: ["/"],
    mutationFn: async () => {
      try {
        const unsignedTx = await tx
          .spendingPlutusScriptV2()
          .txIn("6213d54eac79892450e0125a0ced7a86711f0522b8b44e62f9e2b3ea", 0)
          .txInInlineDatumPresent()
          .txInRedeemerValue(plutusScript, "JSON")
          .spendingTxInReference(
            "6213d54eac79892450e0125a0ced7a86711f0522b8b44e62f9e2b3ea",
            0
          )
          .complete();
        const signedTx = await wallet.signTx(unsignedTx);
        const txHash = await wallet.submitTx(signedTx);
        console.log(txHash);
        return txHash;
      } catch (error) {
        console.log(error);
      }
    },
  });
}
