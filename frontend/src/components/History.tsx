import Transaction from "@/interface/transaction";
import { Link } from "react-router-dom";
import { previewCardanoUrl } from "@/constants";

interface Props {
  transactions: Transaction[];
}

function History({ transactions }: Props) {
  const renderStatus = (status: string) => {
    if (status === "pending")
      return <span className="text-yellow-500">Pending</span>;
    if (status === "completed")
      return <span className="text-green-500">Completed</span>;
    if (status === "failed")
      return <span className="text-red-500">Failed</span>;
  };

  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="w-full">
      <div className="text-3xl font-bold mb-2">Recent Transactions</div>
      {sortedTransactions.length === 0 ? (
        <div className="bg-white p-3 rounded-2xl my-2 text-gray-500 text-center">
          No transactions yet
        </div>
      ) : (
        sortedTransactions.map((transaction, index) => (
          <div
            key={transaction.id || index}
            className="bg-white p-3 rounded-2xl my-2"
          >
            <div className="text-[16px] leading-7 font-medium">
              To: <span className="font-normal">{transaction.address}</span>
            </div>
            <div className="text-[16px] leading-7 font-medium">
              Quantity:{" "}
              <span className="font-normal">{transaction.quantity} ADA</span>
            </div>
            <div className="text-[16px] leading-7 break-words font-medium">
              <span>Hash:</span>{" "}
              {transaction.hash ? (
                <Link
                  target="_blank"
                  className="text-blue-500 font-normal"
                  to={`${previewCardanoUrl}/tx/${transaction.hash}`}
                  rel="noopener noreferrer"
                >
                  {transaction.hash}
                </Link>
              ) : (
                <span className="text-gray-400 font-normal">Pending...</span>
              )}
            </div>
            <div className="text-[16px] leading-7 font-medium">
              Date: <span className="font-normal">{transaction.date}</span>
            </div>
            <div className="text-[16px] leading-7 font-medium">
              Status: {renderStatus(transaction.status!)}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default History;
