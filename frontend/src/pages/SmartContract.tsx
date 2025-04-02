import { useForm } from "react-hook-form";
import { lockAsset, unlockAsset } from "../hooks/useAsset";
import FormItem from "../components/ui/FormItem";

interface Inputs {
  quantity: string;
  message: string;
}

function SmartContract() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const {
    handleLockAsset,
    isPending: loadingLockAsset,
    dataHash,
  } = lockAsset();
  const { mutate: handleUnlockAsset, isPending: loadingUnlockAsset } =
    unlockAsset();

  const onSubmitLockAsset = (data: Inputs) => {
    handleLockAsset(data);
  };

  return (
    <div className="w-[500px] mx-auto h-screen flex flex-col justify-center items-center gap-5">
      <div className="w-full flex flex-col bg-white p-3 rounded-2xl !shadow-[0_1px_8px_0_rgba(0,0,0,0.2)] gap-2.5">
        <FormItem
          type="number"
          label="Quantity"
          registration={register("quantity", {
            required: "Must enter",
            min: {
              value: 1000000,
              message: "quantity must be greater than or equal to 1000000",
            },
          })}
          error={errors.quantity?.message}
        />
        <FormItem
          type="text"
          label="Message (Optional)"
          registration={register("message")}
          error={errors.message?.message}
        />
        <button
          disabled={loadingLockAsset}
          className={`w-full text-center px-4 py-2 bg-primary text-white rounded-4xl cursor-pointer`}
          onClick={handleSubmit(onSubmitLockAsset)}
        >
          {loadingLockAsset ? "Loading..." : "Lock Asset"}
        </button>
        <div>{dataHash}</div>
        {dataHash && (
          <button
            disabled={loadingUnlockAsset}
            className={`w-full text-center px-4 py-2 bg-primary text-white rounded-4xl cursor-pointer`}
            onClick={() => handleUnlockAsset()}
          >
            {loadingUnlockAsset ? "Loading..." : "Unlock Asset"}
          </button>
        )}
        <button
          disabled={loadingUnlockAsset}
          className={`w-full text-center px-4 py-2 bg-primary text-white rounded-4xl cursor-pointer`}
          onClick={() => handleUnlockAsset()}
        >
          {loadingUnlockAsset ? "Loading..." : "Unlock Asset"}
        </button>
      </div>
    </div>
  );
}

export default SmartContract;
