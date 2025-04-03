import { instanceBlockfrost } from "@/config/axios";

export const getTransactionUtxos = async (hash: string) => {
  try {
    const response = await instanceBlockfrost.get(`/txs/${hash}/utxos`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
