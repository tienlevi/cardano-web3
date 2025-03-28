import { MeshProvider } from '@meshsdk/react'
import { ReactNode } from 'react'

function MeshContext({ children }: { children: ReactNode }) {
  return <MeshProvider>{children}</MeshProvider>
}

export default MeshContext
