import { useWallet } from "@meshsdk/react";
import Transactions from "../components/Transactions";
import History from "../components/History";
import useTransactionStore from "../hooks/useTransactionStore";

function Transaction() {
  const { connected } = useWallet();
  const { transactions } = useTransactionStore();

  return (
    <div className="w-[500px] mx-auto h-screen flex flex-col justify-center items-center gap-5">
      <div className="text-4xl font-bold">Mesh SDK</div>
      {connected && (
        <>
          <Transactions />
          <History transactions={transactions} />
        </>
      )}
    </div>
  );
}

export default Transaction;
