import FormItem from "./ui/FormItem";
import { useMutation } from "@tanstack/react-query";
import { useWallet } from "@meshsdk/react";
import { useForm } from "react-hook-form";

function SignData() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { wallet } = useWallet();
  const { mutate: handleSignData } = useMutation({
    mutationKey: ["/"],
    mutationFn: async (data: any) => {
      return await wallet.signData(data.message);
    },
  });

  const onSubmit = (data: any) => {
    handleSignData(data);
  };
  return (
    <div className="w-full flex flex-col bg-white p-3 rounded-2xl !shadow-[0_1px_8px_0_rgba(0,0,0,0.2)] gap-2.5">
      <FormItem
        type="text"
        label="Message (Optional)"
        registration={register("message")}
        error={errors.message?.message as any}
      />
      <div
        className={`w-full text-center px-4 py-2 bg-primary text-white rounded-4xl cursor-pointer`}
        onClick={handleSubmit(onSubmit)}
      >
        Sign data
      </div>
    </div>
  );
}

export default SignData;
