import { useState } from 'react'
import { useWallet } from '@meshsdk/react'
import { useMutation } from '@tanstack/react-query'
import FormItem from './ui/FormItem'

function Transaction() {
  const [message, setMessage] = useState<string>('')
  const { wallet } = useWallet()

  const { mutate: handleSignData } = useMutation({
    mutationKey: ['/'],
    mutationFn: async () => {
      return await wallet.signData(message)
    },
  })

  return (
    <div className='w-full flex flex-col bg-white p-3 rounded-2xl shadow-[0_1px_8px_0_rgba(0,0,0,0.2)]'>
      <FormItem label='Message' value={message} onChange={(e) => setMessage(e.target.value)} />
      <div
        className={`w-[120px] text-center px-4 py-2 bg-primary text-white rounded-4xl cursor-pointer`}
        onClick={() => handleSignData()}
      >
        Sign data
      </div>
    </div>
  )
}

export default Transaction
