import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import FormItem from "@/components/ui/FormItem";
import { mintValidator } from "@/validations";
import useMint from "@/hooks/useMint";

function Mint() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(mintValidator) });
  const { handleMint, handleBurn, isPending } = useMint();

  return (
    <div className="w-[500px] mx-auto h-screen flex flex-col justify-center items-center gap-5">
      <div className="text-[30px] font-bold text-center">Mint</div>
      <div className="w-full flex flex-col bg-white p-3 rounded-2xl !shadow-[0_1px_8px_0_rgba(0,0,0,0.2)] gap-2.5">
        <div className="text-[24px] text-center">Create mint token</div>
        <FormItem
          type="text"
          label="Token name"
          registration={register("tokenName")}
          error={errors.tokenName?.message}
        />
        <FormItem
          label="Description"
          type="text"
          registration={register("description")}
          error={errors.description?.message}
        />
        <FormItem
          label="Image (ipfs://)"
          type="text"
          registration={register("image")}
          error={errors.image?.message}
          placeholder="ipfs://QmSGa9RTXt3CF4NSnAEt6WYowDXPpsPR2jksnuPUWyc9K1"
        />
        <FormItem
          label="Quantity (Token)"
          type="text"
          registration={register("quantity")}
          error={errors.quantity?.message}
        />
        <FormItem
          label="Expire time"
          type="text"
          registration={register("expire")}
          error={errors.expire?.message}
        />
        <button
          onClick={handleSubmit((data) => handleMint(data))}
          disabled={isPending}
          type="submit"
          className={`w-full text-center px-4 py-2 bg-primary text-white rounded-4xl cursor-pointer`}
        >
          {isPending ? "Loading..." : "Mint"}
        </button>
        <button
          onClick={handleSubmit((data) => handleBurn(data))}
          disabled={isPending}
          type="submit"
          className={`w-full text-center px-4 py-2 bg-primary text-white rounded-4xl cursor-pointer`}
        >
          {isPending ? "Loading..." : "Burn"}
        </button>
      </div>
    </div>
  );
}

export default Mint;
