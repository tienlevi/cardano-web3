import { MeshTxBuilder } from "@meshsdk/core";
import { useWallet } from "@meshsdk/react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import { v4 as uuidv4 } from "uuid";
import History from "@/components/History";
import { toast } from "react-toastify";
import useTransactionStore from "@/hooks/useTransactionStore";
import { TransactionForm, transactionValidator } from "@/validations";
import useUser from "@/hooks/useUser";
import { provider } from "@/utils/provider";
import FormItem from "@/components/ui/FormItem";
import Button from "@/components/ui/Button";

function Transaction() {
  const { connected } = useWallet();
  const { transactions, addTransaction, updateTransaction } =
    useTransactionStore();
  const { wallet } = useWallet();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(transactionValidator),
  });
  const { address, utxos } = useUser();
  const txBuilder = new MeshTxBuilder({
    fetcher: provider,
    verbose: true,
  });

  const { mutate: handleSendTransaction, isPending } = useMutation({
    mutationKey: ["/"],
    mutationFn: async (data: TransactionForm) => {
      const id = uuidv4();
      const addresses = data.address.split(",").map((addr) => addr);
      addTransaction({
        id: id,
        address: data.address,
        status: "pending",
        hash: "",
        quantity: data.quantity,
        date: new Date().toLocaleString(),
      });
      addresses.forEach((addr) => {
        txBuilder.txOut(addr, [
          { unit: "lovelace", quantity: data.quantity.toString() },
        ]);
      });
      try {
        const tx = await txBuilder
          .setNetwork("preview")
          .changeAddress(address!)
          .selectUtxosFrom(utxos!)
          .complete();

        const signedTxs = await wallet.signTx(tx);
        const txHash = await wallet.submitTx(signedTxs);
        updateTransaction(id, {
          id: id,
          address: addresses.join(", "),
          status: txHash ? "completed" : "failed",
          hash: txHash,
          quantity: data.quantity,
          date: new Date().toLocaleString(),
        });

        return txHash;
      } catch (error) {
        updateTransaction(id, {
          id: id,
          address: addresses.join(", "),
          status: "failed",
          hash: "",
          quantity: data.quantity,
          date: new Date().toLocaleString(),
        });
        toast.error("Transaction failed");
      }
    },
    onSuccess: (data) => {
      if (data) {
        toast.success("Transaction success");
      } else {
        toast.error("Transaction failed");
      }
    },
    onError: () => {},
  });

  const onSubmit = (data: TransactionForm) => {
    handleSendTransaction(data);
  };

  return (
    <div className="w-[500px] mx-auto h-screen flex flex-col justify-center items-center gap-5">
      <div className="text-4xl font-bold">Mesh SDK</div>
      {connected && (
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
          <History transactions={transactions} />
        </>
      )}
    </div>
  );
}

export default Transaction;
