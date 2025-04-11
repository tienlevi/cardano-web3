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
      // const lockUntil = new Date(2025, 3, 12, 10, 25).getTime();
      const lockUntil = new Date();
      lockUntil.setMinutes(lockUntil.getMinutes() + 1);
      const tx = await txBuilder
        .setNetwork("preview")
        .txOut(data.beneficiaryAddress, [
          { unit: "lovelace", quantity: data.quantity.toString() },
        ])
        .txOutInlineDatumValue(
          mConStr0([
            lockUntil.getTime(),
            ownerPubKeyHash,
            beneficiaryPubKeyHash,
          ])
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
      const fetchUtxos = await provider.fetchUTxOs(
        "636763080df6ba36ddea5c3e0fde1704e6b4c6db72ef40655b83348d78678f65"
      );
      const currentTime = new Date().getTime();
      const laterTime = new Date(currentTime + 2 * 60 * 60 * 1000).getTime();
      const invalidBefore = unixTimeToEnclosingSlot(
        currentTime,
        SLOT_CONFIG_NETWORK.preview
      );
      const invalidAfter = unixTimeToEnclosingSlot(
        laterTime,
        SLOT_CONFIG_NETWORK.preview
      );

      const { pubKeyHash: ownerPubKeyHash } = deserializeAddress(
        data.beneficiaryAddress
      );
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
        .invalidHereafter(invalidBefore)
        .invalidBefore(invalidAfter)
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
