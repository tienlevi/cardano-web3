import FormItem from "../components/ui/FormItem";
import { useForm } from "react-hook-form";
import useVesting from "../hooks/useVesting";
import { yupResolver } from "@hookform/resolvers/yup";
import { WithdrawForm, withdrawValidator } from "../validations";

function Vesting() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(withdrawValidator) });

  const { handleDeposit, loadingDeposit, handleWithdraw, loadingWithdraw } =
    useVesting();

  const onSubmitDeposit = (data: WithdrawForm) => {
    handleDeposit(data);
  };

  const onSubmitWithdraw = (data: WithdrawForm) => {
    handleWithdraw(data);
  };

  return (
    <div className="w-[500px] mx-auto h-screen flex flex-col justify-center items-center gap-5">
      <div className="text-[30px] font-bold text-center">Vesting</div>
      <div className="w-full flex flex-col bg-white p-3 rounded-2xl !shadow-[0_1px_8px_0_rgba(0,0,0,0.2)] gap-2.5">
        <FormItem
          type="text"
          label="Owner Address"
          registration={register("ownerAddress", {
            required: "Must enter",
          })}
          error={errors.ownerAddress?.message}
        />
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
        <button
          type="submit"
          onClick={handleSubmit(onSubmitDeposit)}
          disabled={loadingDeposit}
          className={`w-full text-center px-4 py-2 bg-primary text-white rounded-4xl cursor-pointer`}
        >
          {loadingDeposit ? "Loading..." : "Deposit"}
        </button>
        {/* {txHashDeposit && ( */}
        <button
          type="submit"
          onClick={handleSubmit(onSubmitWithdraw)}
          disabled={loadingWithdraw}
          className={`w-full text-center px-4 py-2 bg-primary text-white rounded-4xl cursor-pointer`}
        >
          {loadingWithdraw ? "Loading..." : "Withdraw"}
        </button>
        {/* )} */}
      </div>
    </div>
  );
}

export default Vesting;
