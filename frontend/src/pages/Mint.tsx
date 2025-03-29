import type { AssetMetadata, Mint } from '@meshsdk/core'

function Mint() {
  const assetMetadata: AssetMetadata = {
    name: 'Mesh Token',
    image: 'ipfs://QmRzicpReutwCkM6aotuKjErFCUD213DpwPq6ByuzMJaua',
    mediaType: 'image/jpg',
    description: 'This NFT was minted by Mesh (https://meshjs.dev/).',
  }

  const asset: Mint = {
    assetName: 'MeshToken',
    assetQuantity: '1',
    metadata: assetMetadata,
    label: '721',
    recipient: 'addr_test1vpvx0sacufuypa2k4sngk7q40zc5c4npl337uusdh64kv0c7e4cxr',
  }
  return <div>Mint</div>
}

export default Mint
