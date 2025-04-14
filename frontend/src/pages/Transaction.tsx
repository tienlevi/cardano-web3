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
    reset,
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
      const addresses = data.address.split(",").map((addr) => addr.trim());

      // Add transaction to store as pending
      addTransaction({
        id: id,
        address: addresses.join(", "),
        status: "pending",
        hash: "",
        quantity: data.quantity,
        date: new Date().toLocaleString(),
      });

      try {
        // Create a new transaction builder for each transaction
        const builder = new MeshTxBuilder({
          fetcher: provider,
          verbose: true,
        });

        // Add outputs for each address
        addresses.forEach((addr) => {
          builder.txOut(addr, [
            { unit: "lovelace", quantity: data.quantity.toString() },
          ]);
        });

        // Set validity time range - this helps avoid the TimeTranslationPastHorizon error
        // Current time in seconds
        const now = Math.floor(Date.now() / 1000);
        // 10 hours in the future (36000 seconds)
        const futureTime = now + 36000;

        // Complete the transaction with proper validity interval
        const tx = await builder
          .setNetwork("preview")
          .changeAddress(address!)
          .selectUtxosFrom(utxos!)
          .invalidBefore(now) // Transaction valid from now
          .invalidHereafter(futureTime) // Transaction valid until future time
          .complete();

        // Sign and submit
        const signedTx = await wallet.signTx(tx);
        const txHash = await wallet.submitTx(signedTx);

        // Update transaction status
        updateTransaction(id, {
          id: id,
          address: addresses.join(", "),
          status: "completed",
          hash: txHash,
          quantity: data.quantity,
          date: new Date().toLocaleString(),
        });

        // Reset form after successful transaction
        reset();

        return txHash;
      } catch (error) {
        console.error("Transaction error:", error);

        // Update transaction as failed
        updateTransaction(id, {
          id: id,
          address: addresses.join(", "),
          status: "failed",
          hash: "",
          quantity: data.quantity,
          date: new Date().toLocaleString(),
        });

        throw error;
      }
    },
    onSuccess: (txHash) => {
      if (txHash) {
        toast.success("Transaction successful");
      } else {
        toast.error("Transaction failed");
      }
    },
    onError: (error) => {
      console.error("Transaction error:", error);
      toast.error("Transaction failed. Please try again.");
    },
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
              label="Address (separate multiple addresses with commas)"
              registration={register("address")}
              error={errors.address?.message}
            />
            <FormItem
              label="Quantity (ADA per transaction)"
              type="number"
              registration={register("quantity")}
              error={errors.quantity?.message}
            />

            <Button>{isPending ? "Processing..." : "Send Transaction"}</Button>
          </form>
          <History transactions={transactions} />
        </>
      )}
    </div>
  );
}

export default Transaction;
