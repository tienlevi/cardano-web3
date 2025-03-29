import { useWallet } from '@meshsdk/react'
import useUser from '@/hooks/useUser'
import { useState, useRef, useEffect } from 'react'
import usePersist from '@/hooks/usePersist'

function ConnectWallet() {
  const { connected, connecting, connect, disconnect } = useWallet()
  const { address, isLoadingAddress, balance } = useUser()
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const namePersist = usePersist()

  const handleConnect = async () => {
    await connect('lace', [8, 30, 95], true)
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <>
      {connected || namePersist === 'lace' ? (
        <div className='relative' ref={dropdownRef}>
          <button
            className='px-4 py-2 bg-primary text-white rounded-4xl'
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </button>

          {isDropdownOpen && (
            <div className='absolute left-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-2'>
              <div className='px-4 py-2'>
                <div className='text-sm text-gray-600'>Address</div>
                <div className='text-sm font-medium break-all'>{isLoadingAddress ? 'Loading' : address}</div>
              </div>
              <div className='px-4 py-2'>
                <div className='text-sm text-gray-600'>Balance</div>
                <div className='text-sm font-medium'>
                  {balance?.[0]?.quantity} {balance?.[0]?.unit}
                </div>
              </div>
              <div className='border-t border-gray-100 mt-2'>
                <button
                  className='w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50'
                  onClick={disconnect}
                >
                  Disconnect
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          className={`w-[180px] text-center px-4 py-2 bg-primary text-white rounded-4xl cursor-pointer`}
          onClick={() => handleConnect()}
        >
          {connecting ? 'Connecting...' : 'Connect Wallet'}
        </div>
      )}
    </>
  )
}

export default ConnectWallet
