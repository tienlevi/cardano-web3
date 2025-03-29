import useUser from '@/hooks/useUser'
import { ForgeScript } from '@meshsdk/core'
import type { AssetMetadata } from '@meshsdk/core'
import { useWallet } from '@meshsdk/react'

function Mint() {
  // const { utxos, address } = useUser()
  const assetMetadata: AssetMetadata = {
    name: 'Mesh Token',
    image: 'ipfs://QmRzicpReutwCkM6aotuKjErFCUD213DpwPq6ByuzMJaua',
    mediaType: 'image/jpg',
    description: 'This NFT was minted by Mesh (https://meshjs.dev/).',
  }

  const { connected, connecting, connect } = useWallet()

  return (
    <div className='w-[500px] mx-auto h-screen flex flex-col justify-center items-center gap-5'>
      <div className='text-4xl font-bold'>Mesh SDK</div>
      {connected ? (
        <div className='w-full flex flex-col bg-white p-3 rounded-2xl shadow-[0_1px_8px_0_rgba(0,0,0,0.2)] gap-2.5'>
          Mint
        </div>
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

export default Mint
