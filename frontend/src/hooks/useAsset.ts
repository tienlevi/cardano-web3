import { resolvePlutusScriptAddress, Transaction, resolvePaymentKeyHash } from '@meshsdk/core'
import { useQuery, useMutation } from '@tanstack/react-query'
import type { PlutusScript, Data } from '@meshsdk/core'
import { useWallet } from '@meshsdk/react'
import plutusScript from '../data/plutus.json'
import cbor from 'cbor'

export function lockAsset() {
  const { wallet } = useWallet()
  const script: PlutusScript = {
    code: cbor.encode(Buffer.from(plutusScript.validators[0].compiledCode, 'hex')).toString('hex'),
    version: 'V2',
  }
  const { data: hash } = useQuery({
    queryKey: ['/'],
    queryFn: async () => {
      return resolvePaymentKeyHash((await wallet.getUsedAddresses())[0])
    },
  })
  const datum: Data = {
    alternative: 0,
    fields: [hash ? hash : ''],
  }
  const scriptAddress = resolvePlutusScriptAddress(script, 0)

  const tx = new Transaction({ initiator: wallet }).sendLovelace(
    {
      address: scriptAddress,
      datum: { value: datum },
    },
    '0',
  )

  return useMutation({
    mutationKey: ['/'],
    mutationFn: async () => {
      try {
        const unsignedTx = await tx.build()
        const signedTx = await wallet.signTx(unsignedTx)
        const txHash = await wallet.submitTx(signedTx)
        console.log(txHash)
        return txHash
      } catch (error) {
        console.log(error)
      }
    },
  })
}

export function unlockAsset() {
  return
}
