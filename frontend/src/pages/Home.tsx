import Transactions from '@/components/Transactions'
import { useWallet } from '@meshsdk/react'

function Home() {
  const { connected, connecting, connect } = useWallet()

  return (
    <div className='w-[500px] mx-auto h-screen flex flex-col justify-center items-center gap-5'>
      <div className='text-4xl font-bold'>Mesh SDK</div>
      {connected ? (
        <>
          <Transactions />
        </>
      ) : (
        <div
          className={`w-[180px] text-center px-4 py-2 bg-primary text-white rounded-4xl cursor-pointer`}
          onClick={() => connect('lace', [8, 30, 95], true)}
        >
          {connecting ? 'Connecting...' : 'Connect Wallet'}
        </div>
      )}
    </div>
  )
}

export default Home
