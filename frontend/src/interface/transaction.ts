interface ITransaction {
  id?: string;
  address: string;
  quantity?: number;
  hash: string;
  date: string;
  status?: "completed" | "failed" | "pending";
}

export default ITransaction;
