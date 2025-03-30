import { useWallet } from '@meshsdk/react'
import Transactions from '@/components/Transactions'

function Transaction() {
  const { connected } = useWallet()

  return (
    <div className='w-[500px] mx-auto h-screen flex flex-col justify-center items-center gap-5'>
      <div className='text-4xl font-bold'>Mesh SDK</div>
      {connected && <Transactions />}
    </div>
  )
}

export default Transaction
