import { useState } from "react";
import { VestingDatum } from "@meshsdk/contract";
import {
  deserializeAddress,
  deserializeDatum,
  mConStr0,
  MeshTxBuilder,
  PlutusScript,
  SLOT_CONFIG_NETWORK,
  unixTimeToEnclosingSlot,
} from "@meshsdk/core";
import { useWallet } from "@meshsdk/react";
import { provider } from "../utils/provider";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import vestingScript from "../data/vesting.json";
import useUser from "./useUser";
import { VestingForm } from "@/validations";

const script: PlutusScript = {
  code: vestingScript.validators[0].compiledCode,
  version: "V3",
};

function useVesting() {
  const { wallet } = useWallet();
  const { address, utxos, collateral } = useUser();
  const [txHashDeposit, setTxHashDeposit] = useState<string>("");
  const txBuilder = new MeshTxBuilder({
    fetcher: provider,
    submitter: provider,
  });

  // const { address: scriptAddress } = serializePlutusScript(script);
  // console.log(scriptAddress);

  const { mutate: handleDeposit, isPending: loadingDeposit } = useMutation({
    mutationKey: ["/"],
    mutationFn: async (data: VestingForm) => {
      const { pubKeyHash: beneficiaryPubKeyHash } = deserializeAddress(
        data.beneficiaryAddress
      );
      const { pubKeyHash: ownerPubKeyHash } = deserializeAddress(address ?? "");
      const lockUntil = new Date(2025, 3, 10, 10, 25).getTime();
      const tx = await txBuilder
        .setNetwork("preview")
        .txOut(data.beneficiaryAddress, [
          { unit: "lovelace", quantity: data.quantity.toString() },
        ])
        .txOutInlineDatumValue(
          mConStr0([lockUntil, ownerPubKeyHash, beneficiaryPubKeyHash])
        )
        .changeAddress(address!)
        .selectUtxosFrom(utxos!)
        .complete();
      const signedTx = await wallet.signTx(tx);
      const txHash = await wallet.submitTx(signedTx);
      return txHash;
    },
    onSuccess: (data) => {
      console.log(data);
      toast.success("Deposit success");
      setTxHashDeposit(data);
    },
    onError(error) {
      console.log(error);
    },
  });

  const { mutate: handleWithdraw, isPending: loadingWithdraw } = useMutation({
    mutationKey: ["/"],
    mutationFn: async (data: VestingForm) => {
      const fetchUtxos = await provider.fetchUTxOs(txHashDeposit);
      const { pubKeyHash: ownerPubKeyHash } = deserializeAddress(
        data.beneficiaryAddress
      );
      const datum = deserializeDatum<VestingDatum>(
        fetchUtxos?.[0]?.output.plutusData!
      );
      const invalid =
        unixTimeToEnclosingSlot(
          Math.min(Number(datum.fields[0].int), Date.now() - 15000),
          SLOT_CONFIG_NETWORK.preprod
        ) + 1;
      await txBuilder
        .setNetwork("preview")
        .spendingPlutusScriptV3()
        .txIn(
          fetchUtxos[0].input.txHash,
          fetchUtxos[0].input.outputIndex,
          fetchUtxos[0].output.amount,
          data.beneficiaryAddress
        )
        .spendingReferenceTxInInlineDatumPresent()
        .spendingReferenceTxInRedeemerValue("")
        .txInScript(script.code)
        .txOut(address!, [])
        .txInCollateral(
          collateral?.[0]?.input.txHash!,
          collateral?.[0]?.input.outputIndex!,
          collateral?.[0]?.output.amount,
          collateral?.[0]?.output.address
        )
        .invalidBefore(invalid)
        .requiredSignerHash(ownerPubKeyHash)
        .changeAddress(address!)
        .selectUtxosFrom(fetchUtxos)
        .complete();

      const unsignedTx = txBuilder.txHex;
      const signedTx = await wallet.signTx(unsignedTx, true);
      const txHash = await wallet.submitTx(signedTx);
      console.log(txHash);

      return txHash;
    },
    onSuccess: () => {
      toast.success("Withdraw success");
    },
    onError: (error) => {
      console.error("Withdraw error:", error);
    },
  });

  return {
    handleDeposit,
    loadingDeposit,
    txHashDeposit,
    handleWithdraw,
    loadingWithdraw,
  };
}

export default useVesting;
