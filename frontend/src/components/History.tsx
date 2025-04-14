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

  return (
    <div className="w-full">
      <div className="text-3xl font-bold mb-2">Recent Transactions</div>
      {transactions?.map((transaction, index) => (
        <div key={index} className="bg-white p-3 rounded-2xl my-2">
          <div className="text-[16px] leading-7">To: {transaction.address}</div>
          <div className="text-[16px] leading-7">
            Quantity: {transaction.quantity} ADA
          </div>
          <div className="text-[16px] leading-7 break-words">
            <span>Hash:</span>{" "}
            <Link
              target="_blank"
              className="text-blue-500"
              to={`${previewCardanoUrl}/transaction/${transaction.hash}`}
            >
              {transaction.hash}
            </Link>
          </div>
          <div className="text-[16px] leading-7">
            Date Transaction: {transaction.date}
          </div>
          <div className="text-[16px] leading-7">
            Status:{" "}
            <span className={`text-green-500`}>
              {renderStatus(transaction.status!)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default History;
