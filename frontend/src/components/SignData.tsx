import { useState } from 'react'
import FormItem from './ui/FormItem'
import { useMutation } from '@tanstack/react-query'
import { useWallet } from '@meshsdk/react'

function SignData() {
  const [message, setMessage] = useState<string>('')
  const { wallet } = useWallet()
  const { mutate: handleSignData } = useMutation({
    mutationKey: ['/'],
    mutationFn: async () => {
      return await wallet.signData(message)
    },
  })
  return (
    <div className='w-full flex flex-col bg-white p-3 rounded-2xl shadow-[0_1px_8px_0_rgba(0,0,0,0.2)] gap-2.5'>
      <FormItem label='Message' value={message} onChange={(e) => setMessage(e.target.value)} />
      <div
        className={`w-full text-center px-4 py-2 bg-primary text-white rounded-4xl cursor-pointer`}
        onClick={() => handleSignData()}
      >
        Sign data
      </div>
    </div>
  )
}

export default SignData
