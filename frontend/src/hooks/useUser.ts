import { useAddress, useAssets, useLovelace, useWallet } from "@meshsdk/react";
import { useQuery } from "@tanstack/react-query";

function useUser() {
  const { wallet } = useWallet();
  const address = useAddress();
  const assest = useAssets();
  const balance = useLovelace();

  const { data: utxos } = useQuery({
    queryKey: ["/"],
    queryFn: async () => {
      return await wallet.getUtxos();
    },
  });

  const { data: rewardAddresses } = useQuery({
    queryKey: ["/"],
    queryFn: async () => {
      return await wallet.getRewardAddresses();
    },
  });

  const { data: policyId } = useQuery({
    queryKey: ["/"],
    queryFn: async () => {
      return await wallet.getPolicyIds();
    },
  });

  const { data: usedAddress } = useQuery({
    queryKey: ["/"],
    queryFn: async () => {
      return await wallet.getUsedAddresses();
    },
  });

  return {
    address,
    assest,
    usedAddress,
    balance,
    rewardAddresses,
    policyId,
    utxos,
  };
}

export default useUser;
