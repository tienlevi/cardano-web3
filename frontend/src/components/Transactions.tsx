import { useState } from 'react'
import { useWallet } from '@meshsdk/react'
import { Transaction } from '@meshsdk/core'
import { useMutation } from '@tanstack/react-query'
import FormItem from './ui/FormItem'
import { provider } from '@/utils/provider'

function Transactions() {
  const { wallet } = useWallet()
  const tx = new Transaction({ initiator: wallet, fetcher: provider, verbose: true })

  const { mutate: handleSendTransaction, isPending } = useMutation({
    mutationKey: ['/'],
    mutationFn: async () => {
      const unsignedTx = await tx.build()
      const signTx = await wallet.signTx(unsignedTx)
      const txHash = await wallet.submitTx(signTx)
      return txHash
    },
  })

  return (
    <div className='w-full flex flex-col bg-white p-3 rounded-2xl shadow-[0_1px_8px_0_rgba(0,0,0,0.2)] gap-2.5'>
      <div
        className={`w-full text-center px-4 py-2 bg-primary text-white rounded-4xl cursor-pointer`}
        onClick={() => handleSendTransaction()}
      >
        {isPending ? 'Sending...' : 'Send Transaction'}
      </div>
    </div>
  )
}

export default Transactions
