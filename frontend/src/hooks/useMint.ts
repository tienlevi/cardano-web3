import {
  deserializeAddress,
  ForgeScript,
  MeshTxBuilder,
  NativeScript,
  resolveScriptHash,
  resolveSlotNo,
  stringToHex,
} from "@meshsdk/core";
import { useWallet } from "@meshsdk/react";
import useUser from "./useUser";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { provider } from "@/utils/provider";
import { expireTime } from "@/utils/time";
import { MintForm } from "@/validations";

function useMint() {
  const { wallet } = useWallet();
  const { address, utxos } = useUser();
  const txBuilder = new MeshTxBuilder({
    fetcher: provider,
    verbose: true,
  });
  const { pubKeyHash } = deserializeAddress(
    address! ??
      "addr_test1qpxjn9urjwc6nsyypxdgyrdwgtakdgr4d4fxvs5nqxslju4t7juyxpy2qww5wt8rad0709k6mksxat98sk45j9kalv3sda2g78"
  );
  const nativeScript: NativeScript = {
    type: "all",
    scripts: [
      { type: "before", slot: "9999999" },
      { type: "sig", keyHash: pubKeyHash },
    ],
  };
  const forgingScript = ForgeScript.fromNativeScript(nativeScript);
  const policyId = resolveScriptHash(forgingScript);

  const { mutate: handleMint, ...rest } = useMutation({
    mutationKey: ["/"],
    mutationFn: async (data: MintForm) => {
      const tokenName = data.tokenName;
      const tokenHex = stringToHex(tokenName);
      const metadata = {
        [policyId]: {
          [tokenName]: {
            tokenHex,
            description: data.description,
            image: data.image,
          },
        },
      };
      const dateTime = expireTime(data.expire);
      const slot = resolveSlotNo("preview", dateTime.getTime());

      const unsignedTx = await txBuilder
        .setNetwork("preview")
        .mint(data.quantity.toString(), policyId, tokenHex)
        .mintingScript(forgingScript)
        .metadataValue(721, metadata)
        .changeAddress(address!)
        .invalidHereafter(Number(slot))
        .selectUtxosFrom(utxos!)
        .complete();
      const signedTx = await wallet.signTx(unsignedTx);
      const txHash = await wallet.submitTx(signedTx);
      return txHash;
    },
    onSuccess: () => {
      toast.success("Mint success");
    },
    onError: (error: any) => {
      console.log(error.info);
      toast.error(error.info);
    },
  });

  return { handleMint, ...rest };
}

export default useMint;
