import { applyParamsToScript, serializePlutusScript } from "@meshsdk/core";
import { provider } from "./provider";

export async function getUtxoByTxHash(txHash: string) {
  const utxos = await provider.fetchUTxOs(txHash);
  if (utxos.length === 0) {
    throw new Error("UTxO not found");
  }
  return utxos[0];
}

export function getScript(json: any) {
  const scriptCbor = applyParamsToScript(json, []);

  const scriptAddr = serializePlutusScript({
    code: scriptCbor,
    version: "V3",
  }).address;

  return { scriptCbor, scriptAddr };
}
