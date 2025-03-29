import { useEffect, useState } from 'react'

function usePersist() {
  const [name, setName] = useState(null)

  useEffect(() => {
    const value = JSON.parse(localStorage.getItem('mesh-wallet-persist')!)
    setName(value?.walletName)
  }, [])
  return name
}

export default usePersist
