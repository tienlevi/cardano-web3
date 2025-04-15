import { useState } from "react";
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
import { getScript } from "@/utils/common";

interface Props {
  timeLock: number;
  txHashDeposit?: string;
  onTxHashDeposit: (value: string) => void;
}

const script: PlutusScript = {
  code: vestingScript.validators[0].compiledCode,
  version: "V3",
};

function useVesting({ timeLock, txHashDeposit, onTxHashDeposit }: Props) {
  const { wallet } = useWallet();
  const { address, utxos, collateral } = useUser();
  const txBuilder = new MeshTxBuilder({
    fetcher: provider,
    submitter: provider,
  });
  const lockUntil = new Date().getTime() + timeLock;
  const { scriptAddr, scriptCbor } = getScript(script.code);

  const { mutate: handleDeposit, isPending: loadingDeposit } = useMutation({
    mutationKey: ["/"],
    mutationFn: async (data: VestingForm) => {
      const { pubKeyHash: beneficiaryPubKeyHash } = deserializeAddress(
        data.beneficiaryAddress
      );
      const { pubKeyHash: ownerPubKeyHash } = deserializeAddress(address ?? "");
      const tx = await txBuilder
        .setNetwork("preview")
        .txOut(scriptAddr, [
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
      onTxHashDeposit(txHash);
      return txHash;
    },
    onSuccess: (data) => {
      console.log(data);
      toast.success("Deposit success");
    },
    onError(error) {
      console.log(error);
    },
  });

  const { mutate: handleWithdraw, isPending: loadingWithdraw } = useMutation({
    mutationKey: ["/"],
    mutationFn: async () => {
      const fetchUtxos = await provider.fetchUTxOs(txHashDeposit!);
      const currentTime = new Date().getTime();
      const laterTime = new Date(currentTime + 2 * 60 * 60 * 1000).getTime();
      const datum = deserializeDatum(fetchUtxos?.[0]?.output?.plutusData!);
      const invalidBefore =
        unixTimeToEnclosingSlot(
          Math.min(Number(datum.fields[0].int), Date.now() - 19000),
          SLOT_CONFIG_NETWORK.preview
        ) + 1;
      const invalidAfter = unixTimeToEnclosingSlot(
        laterTime,
        SLOT_CONFIG_NETWORK.preview
      );
      const { pubKeyHash } = deserializeAddress(address!);

      await txBuilder
        .setNetwork("preview")
        .spendingPlutusScriptV3()
        .txIn(
          fetchUtxos?.[0].input.txHash,
          fetchUtxos?.[0].input.outputIndex,
          fetchUtxos?.[0].output.amount,
          scriptAddr
        )
        .spendingReferenceTxInInlineDatumPresent()
        .spendingReferenceTxInRedeemerValue("")
        .txInScript(scriptCbor)
        .txOut(address!, [])
        .txInCollateral(
          collateral?.[0]?.input.txHash!,
          collateral?.[0]?.input.outputIndex!,
          collateral?.[0]?.output.amount,
          collateral?.[0]?.output.address
        )
        .invalidBefore(invalidBefore)
        .invalidHereafter(invalidAfter)
        .requiredSignerHash(pubKeyHash)
        .changeAddress(address!)
        .selectUtxosFrom(utxos!)
        .complete();

      const unsignedTx = txBuilder.txHex;
      const signedTx = await wallet.signTx(unsignedTx, true);
      const txHash = await wallet.submitTx(signedTx);
      return txHash;
    },
    onSuccess: () => {
      toast.success("Withdraw success");
    },
    onError: (error) => {
      console.log(error);
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
