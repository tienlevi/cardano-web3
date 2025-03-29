import { lockAsset } from '@/hooks/useAsset'

function Asset() {
  const { mutate: handleLockAsset } = lockAsset()

  return (
    <div className='w-[500px] mx-auto h-screen flex flex-col justify-center items-center gap-5'>
      <div
        className={`w-[180px] text-center px-4 py-2 bg-primary text-white rounded-4xl cursor-pointer`}
        onClick={() => handleLockAsset()}
      >
        Lock Asset
      </div>
    </div>
  )
}

export default Asset
