import { lockAsset, unlockAsset } from "../hooks/useAsset";

function SmartContract() {
  const { mutate: handleLockAsset } = lockAsset();
  const { mutate: handleUnlockAsset } = unlockAsset();

  return (
    <div className="w-[500px] mx-auto h-screen flex flex-col justify-center items-center gap-5">
      <div
        className={`w-[180px] text-center px-4 py-2 bg-primary text-white rounded-4xl cursor-pointer`}
        onClick={() => handleLockAsset()}
      >
        Lock Asset
      </div>
      <div
        className={`w-[180px] text-center px-4 py-2 bg-primary text-white rounded-4xl cursor-pointer`}
        onClick={() => handleUnlockAsset()}
      >
        Unlock Asset
      </div>
    </div>
  );
}

export default SmartContract;
