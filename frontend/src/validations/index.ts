import * as yup from "yup";

export const transactionValidator = yup
  .object({
    address: yup.string().required(),
    quantity: yup.number().min(1000000).integer().required(),
  })
  .required();

export const vestingValidator = yup
  .object({
    beneficiaryAddress: yup.string().required(),
    quantity: yup.number().min(10).integer().required(),
  })
  .required();

export const mintValidator = yup.object({
  tokenName: yup.string().required(),
  description: yup.string().required(),
  image: yup
    .string()
    .matches(
      /^ipfs:\/\/(Qm[1-9A-HJ-NP-Za-km-z]{44}|b[0-7A-Za-z]{58}|z[1-9A-HJ-NP-Za-km-z]{48})(\/.*)?$/,
      "Image must be a valid IPFS URI"
    )
    .required(),
  quantity: yup.number().min(10000).integer().required(),
  expire: yup.number().min(1).integer().required(),
});

export type TransactionForm = yup.InferType<typeof transactionValidator>;
export type VestingForm = yup.InferType<typeof vestingValidator>;
export type MintForm = yup.InferType<typeof mintValidator>;
