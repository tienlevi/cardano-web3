import { useWallet } from '@meshsdk/react'
import { MeshTxBuilder } from '@meshsdk/core'
import { useMutation } from '@tanstack/react-query'
import FormItem from './ui/FormItem'
import { provider } from '@/utils/provider'
import useUser from '@/hooks/useUser'

function Transactions() {
  const { wallet } = useWallet()
  const { address, utxos } = useUser()
  const txBuilder = new MeshTxBuilder({
    fetcher: provider,
    verbose: true,
  })

  const { mutate: handleSendTransaction, isPending } = useMutation({
    mutationKey: ['/'],
    mutationFn: async () => {
      try {
        const unsignedTx = await txBuilder
          .txOut('addr_test1vpvx0sacufuypa2k4sngk7q40zc5c4npl337uusdh64kv0c7e4cxr', [
            { unit: 'lovelace', quantity: '1000' },
          ])
          .changeAddress(address!)
          .selectUtxosFrom(utxos!)
          .complete()
        const signTx = await wallet.signTx(unsignedTx)
        const txHash = await wallet.submitTx(signTx)
        return txHash
      } catch (error) {
        console.log(error)
      }
    },
  })

  return (
    <div className='w-full flex flex-col bg-white p-3 rounded-2xl !shadow-[0_1px_8px_0_rgba(0,0,0,0.2)] gap-2.5'>
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
