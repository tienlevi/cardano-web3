import { useAddress, useAssets, useLovelace, useWallet } from "@meshsdk/react";
import { useQuery } from "@tanstack/react-query";

function useUser() {
  const { wallet } = useWallet();
  const address = useAddress();
  const asset = useAssets();
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

  const { data: collateral } = useQuery({
    queryKey: ["/"],
    queryFn: async () => {
      return await wallet.getCollateral();
    },
  });

  return {
    address,
    asset,
    usedAddress,
    balance,
    rewardAddresses,
    policyId,
    utxos,
    collateral,
  };
}

export default useUser;
