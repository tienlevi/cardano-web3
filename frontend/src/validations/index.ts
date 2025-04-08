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

export type TransactionForm = yup.InferType<typeof transactionValidator>;
export type VestingForm = yup.InferType<typeof vestingValidator>;
