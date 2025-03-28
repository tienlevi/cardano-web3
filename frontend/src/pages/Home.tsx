import ConnectWallet from '@/components/ConnectWallet'
import Transaction from '@/components/Transaction'

function Home() {
  return (
    <div className='w-[500px] mx-auto h-screen flex flex-col justify-center items-center gap-5'>
      <div className='text-4xl font-bold'>Mesh SDK</div>
      <ConnectWallet />
      <Transaction />
    </div>
  )
}

export default Home
