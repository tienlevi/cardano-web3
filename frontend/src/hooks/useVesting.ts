import { useEffect, useState } from "react";
import { MeshVestingContract, VestingDatum } from "@meshsdk/contract";
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
import { getTimes } from "../utils/time";

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
  const contract = new MeshVestingContract({
    mesh: txBuilder as any,
    fetcher: provider,
    wallet: wallet,
    networkId: 0,
  });
  const { address: scriptAddress } = serializePlutusScript(script);
  const { pubKeyHash: ownerPubKeyHash } = deserializeAddress(
    address! ||
      "addr_test1qrlawvv4580q9vm8eegjz9sgd4msaxzdjpqhelhnjlk73cc0qt2c8lrpldzeqk2khz7qju955hfedm6jf8wsh5kltgmq0fvp29"
  );

  const { mutate: handleDeposit, isPending: loadingDeposit } = useMutation({
    mutationKey: ["/"],
    mutationFn: async (data: any) => {
      const { pubKeyHash: beneficiaryPubKeyHash } = deserializeAddress(
        "addr_test1xznnmfk43w5cag3m7e9nnfe0wcsg5lx8afv4u9utjk3zxvqgu4azgw9mz5090zfp8jyzhju5kcqtm2cjnr4a3nxm8fxsntlvsu"
      );
      try {
        const lockUntil = new Date(2025, 4, 4, 22, 25).getTime();
        const tx = await txBuilder
          .txOut(scriptAddress, [{ unit: "lovelace", quantity: data.quantity }])
          .txOutInlineDatumValue(
            mConStr0([lockUntil, ownerPubKeyHash, beneficiaryPubKeyHash])
          )
          .changeAddress(address!)
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
  useEffect(() => {
    getTimes(new Date(2025, 4, 2, 22, 10).getTime());
  }, []);

  const { mutate: handleWithdraw, isPending: loadingWithdraw } = useMutation({
    mutationKey: ["/"],
    mutationFn: async () => {
      const txHash = txHashDeposit;
      const utxos = await provider.fetchUTxOs(txHash);

      try {
        const datum = deserializeDatum<VestingDatum>(
          utxos?.[0]?.output.plutusData!
        );
        const invalid =
          unixTimeToEnclosingSlot(
            Math.min(
              Number(datum.fields[0].int),
              new Date(2025, 4, 5, 23, 50).getTime()
            ),
            SLOT_CONFIG_NETWORK.preview
          ) + 1;
        const tx = await txBuilder
          .setNetwork("preview")
          .spendingPlutusScriptV3()
          .txIn(
            utxos[0].input.txHash,
            utxos[0].input.outputIndex,
            utxos[0].output.amount,
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
          .selectUtxosFrom(utxos)
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
