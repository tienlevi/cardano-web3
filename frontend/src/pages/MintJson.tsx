import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import useMint from "@/hooks/useMint";
import { mintValidator } from "@/validations";
import FormItem from "@/components/ui/FormItem";
import JsonUploader from "@/components/JsonUploader";
import { toast } from "react-toastify";

function MintJson() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(mintValidator) });
  const { handleMintPlutus, isPending } = useMint();
  const [jsonFile, setJsonFile] = useState<any>(null);

  const handleJsonUpload = (json: any) => {
    setJsonFile(json);
  };

  const onSubmit = (data: any) => {
    if (!jsonFile) {
      return toast.warning("Please add json file");
    }
    handleMintPlutus({ ...data, json: jsonFile.validators[0].compiledCode });
  };

  return (
    <div className="w-[500px] mx-auto h-screen flex flex-col justify-center items-center gap-5">
      <div className="w-full flex flex-col bg-white p-3 rounded-2xl !shadow-[0_1px_8px_0_rgba(0,0,0,0.2)] gap-2.5">
        <div className="text-[24px] text-center">Mint token with JSON</div>
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
          label="Expire time (days)"
          type="text"
          registration={register("expire")}
          error={errors.expire?.message}
        />
        <JsonUploader onUpload={handleJsonUpload} />
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={isPending}
          type="submit"
          className={`w-full text-center px-4 py-2 bg-primary text-white rounded-4xl cursor-pointer`}
        >
          {isPending ? "Loading..." : "Mint with plutus script"}
        </button>
      </div>
    </div>
  );
}

export default MintJson;
