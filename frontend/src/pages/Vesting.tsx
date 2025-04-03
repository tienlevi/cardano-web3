import FormItem from "../components/ui/FormItem";
import { useForm } from "react-hook-form";
import useVesting from "../hooks/useVesting";
import { yupResolver } from "@hookform/resolvers/yup";
import { transactionValidator } from "../validations";

function Vesting() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(transactionValidator) });

  const {
    handleDeposit,
    loadingDeposit,
    txHashDeposit,
    handleWithdraw,
    loadingWithdraw,
  } = useVesting();

  const onSubmit = (data: any) => {
    handleDeposit(data);
  };

  return (
    <div className="w-[500px] mx-auto h-screen flex flex-col justify-center items-center gap-5">
      <div className="text-[30px] font-bold text-center">Vesting</div>
      <div className="w-full flex flex-col bg-white p-3 rounded-2xl !shadow-[0_1px_8px_0_rgba(0,0,0,0.2)] gap-2.5">
        <FormItem
          type="text"
          label="Address"
          registration={register("address", {
            required: "Must enter",
          })}
          error={errors.address?.message}
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
          onClick={handleSubmit(onSubmit)}
          disabled={loadingDeposit}
          className={`w-full text-center px-4 py-2 bg-primary text-white rounded-4xl cursor-pointer`}
        >
          {loadingDeposit ? "Loading..." : "Deposit"}
        </button>
        {/* {txHashDeposit && ( */}
        <button
          type="submit"
          onClick={() =>
            handleWithdraw(
              "addr_test1wrznndsp9kussem2qacjnutfszsv2u50wsdqq5338ltmkxggwxqgw"
            )
          }
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
