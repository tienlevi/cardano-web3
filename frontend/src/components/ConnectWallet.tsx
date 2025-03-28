import { useWallet } from '@meshsdk/react'
import useUser from '@/hooks/useUser'

function ConnectWallet() {
  const { disconnect } = useWallet()
  const { address, isLoadingAddress, balance } = useUser()

  return (
    <div className='leading-7'>
      <div className='flex items-center gap-3'>
        <div className='w-1/2 flex flex-col'>
          <div className='break-all'>Address: {isLoadingAddress ? 'Loading' : address}</div>
          <div>
            Balance: {balance?.[0]?.quantity} {balance?.[0]?.unit}
          </div>
        </div>
        <div className='w-1/2'>
          <div
            className={`w-[200px] text-center px-4 py-2 bg-primary text-white rounded-4xl float-right cursor-pointer`}
            onClick={disconnect}
          >
            Disconnect
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConnectWallet
