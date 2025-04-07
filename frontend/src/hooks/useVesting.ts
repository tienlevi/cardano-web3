import { useState } from "react";
import { VestingDatum } from "@meshsdk/contract";
import {
  deserializeAddress,
  deserializeDatum,
  mConStr0,
  MeshTxBuilder,
  PlutusScript,
  serializePlutusScript,
  SLOT_CONFIG_NETWORK,
  unixTimeToEnclosingSlot,
} from "@meshsdk/core";
import { useWallet } from "@meshsdk/react";
import { provider } from "../utils/provider";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import vestingScript from "../data/vesting.json";
import useUser from "./useUser";
import { WithdrawForm } from "@/validations";

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

  const { address: scriptAddress } = serializePlutusScript(script);

  const { mutate: handleDeposit, isPending: loadingDeposit } = useMutation({
    mutationKey: ["/"],
    mutationFn: async (data: WithdrawForm) => {
      const { pubKeyHash: beneficiaryPubKeyHash } = deserializeAddress(
        data.beneficiaryAddress
      );
      const { pubKeyHash: ownerPubKeyHash } = deserializeAddress(
        data.ownerAddress
      );
      try {
        const lockUntil = new Date(2025, 3, 7, 10, 25).getTime();
        const tx = await txBuilder
          .setNetwork("preview")
          .txOut(scriptAddress, [
            { unit: "lovelace", quantity: data.quantity.toString() },
          ])
          .txOutInlineDatumValue(
            mConStr0([lockUntil, ownerPubKeyHash, beneficiaryPubKeyHash])
          )
          .changeAddress(data.ownerAddress!)
          .selectUtxosFrom(utxos!)
          .complete();
        const signedTx = await wallet.signTx(tx);
        const txHash = await wallet.submitTx(signedTx);
        console.log(txHash);
        toast.success("Deposit success");
        setTxHashDeposit(txHash);
      } catch (error) {
        console.log(error);
      }
    },
  });

  const { mutate: handleWithdraw, isPending: loadingWithdraw } = useMutation({
    mutationKey: ["/"],
    mutationFn: async (data: WithdrawForm) => {
      const fetchUtxos = await provider.fetchUTxOs(
        "e12245c4bfb553cb09263eb1862d9e3a46e9009aac790c203c44fa102fb50ade"
      );

      const { pubKeyHash: ownerPubKeyHash } = deserializeAddress(
        data.beneficiaryAddress
      );
      try {
        const datum = deserializeDatum<VestingDatum>(
          fetchUtxos?.[0]?.output.plutusData!
        );
        const invalid = unixTimeToEnclosingSlot(
          Math.min(
            Number(datum.fields[0].int),
            new Date(2025, 3, 7, 23, 50).getTime()
          ),
          SLOT_CONFIG_NETWORK.preview
        );

        const tx = await txBuilder
          .setNetwork("preview")
          .spendingPlutusScriptV3()
          .txIn(
            fetchUtxos[0].input.txHash,
            fetchUtxos[0].input.outputIndex,
            fetchUtxos[0].output.amount,
            scriptAddress
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
        const signedTx = await wallet.signTx(tx, true);
        const txHash = await wallet.submitTx(signedTx);
        console.log(txHash);
        toast.success("Withdraw success");
        setTxHashDeposit(txHash);
      } catch (error) {
        console.log(error);
      }
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
