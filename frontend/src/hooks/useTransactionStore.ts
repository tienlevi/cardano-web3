import { create } from "zustand";
import ITransaction from "../interface/transaction";

interface Store {
  transactions: ITransaction[];
  addTransaction: (transaction: ITransaction) => void;
  updateTransaction: (id: string, updates: ITransaction) => void;
}

const useTransactionStore = create<Store>((set) => ({
  transactions: [],
  addTransaction: (transaction: ITransaction) =>
    set(
      (state) => ({ transactions: [...state.transactions, transaction] } as any)
    ),
  updateTransaction: (id: string, updates: ITransaction) =>
    set((state) => ({
      transactions: state.transactions.map((tx) =>
        tx.id === id ? { ...tx, ...updates } : tx
      ),
    })),
}));

export default useTransactionStore;
