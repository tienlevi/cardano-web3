import { useWallet } from "@meshsdk/react";
import { MeshTxBuilder } from "@meshsdk/core";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import FormItem from "./ui/FormItem";
import useUser from "../hooks/useUser";
import { provider } from "../utils/provider";
import { yupResolver } from "@hookform/resolvers/yup";
import { TransactionForm, transactionValidator } from "../validations";
import Button from "./ui/Button";
import { toast } from "react-toastify";
import useTransactionStore from "../hooks/useTransactionStore";

function Transactions() {
  const { wallet } = useWallet();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(transactionValidator),
  });
  const { address, utxos } = useUser();
  const { addTransaction, updateTransaction } = useTransactionStore();
  const id = uuidv4();
  const txBuilder = new MeshTxBuilder({
    fetcher: provider,
    verbose: true,
  });

  const { mutate: handleSendTransaction, isPending } = useMutation({
    mutationKey: ["/"],
    mutationFn: async (data: TransactionForm) => {
      addTransaction({
        id: id,
        address: data.address,
        status: "pending",
        hash: "",
        quantity: data.quantity,
        date: new Date().toLocaleString(),
      });
      try {
        const unsignedTx = await txBuilder
          .txOut(data.address, [
            { unit: "lovelace", quantity: data.quantity.toString() },
          ])
          .changeAddress(address!)
          .selectUtxosFrom(utxos!)
          .complete();
        const signTx = await wallet.signTx(unsignedTx);
        const txHash = await wallet.submitTx(signTx);
        updateTransaction(id, {
          address: data.address,
          hash: txHash,
          status: "completed",
          date: new Date().toLocaleString(),
        });
        return txHash;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: (data) => {
      if (data) {
        toast.success("Transaction success");
      } else {
        toast.error("Transaction failed");
      }
    },
    onError: () => {
      toast.error("Transaction failed");
    },
  });

  const onSubmit = (data: TransactionForm) => {
    handleSendTransaction(data);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col bg-white p-3 rounded-2xl !shadow-[0_1px_8px_0_rgba(0,0,0,0.2)] gap-2.5"
      >
        <FormItem
          label="Address"
          registration={register("address")}
          error={errors.address?.message}
        />
        <FormItem
          label="Quantity (ADA)"
          type="number"
          registration={register("quantity")}
          error={errors.quantity?.message}
        />

        <Button>{isPending ? "Sending..." : "Send Transaction"}</Button>
      </form>
    </>
  );
}

export default Transactions;
