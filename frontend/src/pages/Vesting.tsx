import { useState } from "react";
import { useForm } from "react-hook-form";
import FormItem from "@/components/ui/FormItem";
import useVesting from "@/hooks/useVesting";
import { yupResolver } from "@hookform/resolvers/yup";
import { vestingValidator, VestingForm } from "@/validations";
import TimeSelector from "@/components/TimeSelector";
import { getTimes } from "@/utils/time";

function Vesting() {
  const [time, setTime] = useState<number>(0);
  const [txHash, setTxHash] = useState<string>("");
  const formatDate = getTimes(new Date().getTime() + time);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(vestingValidator) });
  const { handleDeposit, loadingDeposit, handleWithdraw, loadingWithdraw } =
    useVesting({
      timeLock: time,
      txHashDeposit: txHash,
      onTxHashDeposit: (value: string) => {
        setTxHash(value);
      },
    });

  const onSubmitDeposit = (data: VestingForm) => {
    handleDeposit(data);
  };

  return (
    <div className="w-[500px] mx-auto h-screen flex flex-col justify-center items-center gap-5">
      <div className="text-[30px] font-bold text-center">Vesting</div>
      <div className="w-full flex flex-col bg-white p-3 rounded-2xl !shadow-[0_1px_8px_0_rgba(0,0,0,0.2)] gap-2.5">
        <FormItem
          type="text"
          label="Beneficiary Address"
          registration={register("beneficiaryAddress", {
            required: "Must enter",
          })}
          error={errors.beneficiaryAddress?.message}
        />
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
        <TimeSelector
          onChange={(millisecond) => setTime(millisecond)}
          includeSeconds={true}
          label="Select Time"
        />
        <div className="flex">
          <span>
            {formatDate.day}/{formatDate.month}/{formatDate.year} -
          </span>
          <span>
            {formatDate.hours}:{formatDate.minutes}:{formatDate.seconds}
          </span>
        </div>
        <button
          type="submit"
          onClick={handleSubmit(onSubmitDeposit)}
          disabled={loadingDeposit}
          className={`w-full text-center px-4 py-2 bg-primary text-white rounded-4xl cursor-pointer`}
        >
          {loadingDeposit ? "Loading..." : "Deposit"}
        </button>
        <div>Hash: {txHash}</div>
        {txHash && (
          <button
            type="submit"
            onClick={() => handleWithdraw()}
            disabled={loadingWithdraw}
            className={`w-full text-center px-4 py-2 bg-primary text-white rounded-4xl cursor-pointer`}
          >
            {loadingWithdraw ? "Loading..." : "Withdraw"}
          </button>
        )}
      </div>
    </div>
  );
}

export default Vesting;
