import useUser from '@/hooks/useUser'
import { useWallet } from '@meshsdk/react'

function ConnectWallet() {
  const { connected, disconnect, connect } = useWallet()
  const { address, balance } = useUser()

  console.log(balance)

  return (
    <div className='leading-7'>
      {connected ? (
        <div className='flex items-center gap-3'>
          <div className='w-1/2 flex flex-col'>
            <div className='break-all'>Address: {address}</div>
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
      ) : (
        <div className='w-1/2'>
          <div
            className={`text-center px-4 py-2 bg-primary text-white rounded-4xl float-right cursor-pointer`}
            onClick={() => connect('lace', [8, 30, 95], true)}
          >
            Connect
          </div>
        </div>
      )}
    </div>
  )
}

export default ConnectWallet
