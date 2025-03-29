import { useWallet } from '@meshsdk/react'
import { useQuery } from '@tanstack/react-query'

function useUser() {
  const { wallet } = useWallet()
  const { data: address, isLoading: isLoadingAddress } = useQuery({
    queryKey: ['/'],
    queryFn: async () => {
      return await wallet.getChangeAddress()
    },
  })

  const { data: utxos } = useQuery({
    queryKey: ['/'],
    queryFn: async () => {
      return await wallet.getUtxos()
    },
  })

  const { data: balance } = useQuery({
    queryKey: ['/'],
    queryFn: async () => {
      return await wallet.getBalance()
    },
  })

  const { data: rewardAddresses } = useQuery({
    queryKey: ['/'],
    queryFn: async () => {
      return await wallet.getRewardAddresses()
    },
  })

  const { data: policyId } = useQuery({
    queryKey: ['/'],
    queryFn: async () => {
      return await wallet.getPolicyIds()
    },
  })

  return { address, isLoadingAddress, balance, rewardAddresses, policyId, utxos }
}

export default useUser
