import { provider } from "./provider";

export async function getUtxoByTxHash(txHash: string) {
  const utxos = await provider.fetchUTxOs(txHash);
  if (utxos.length === 0) {
    throw new Error("UTxO not found");
  }
  return utxos[0];
}
