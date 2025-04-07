import * as yup from "yup";

export const transactionValidator = yup
  .object({
    address: yup.string().required(),
    quantity: yup.number().min(1000000).integer().required(),
  })
  .required();

export const withdrawValidator = yup
  .object({
    ownerAddress: yup.string().required(),
    beneficiaryAddress: yup.string().required(),
    quantity: yup.number().min(10).integer().required(),
  })
  .required();

export type TransactionForm = yup.InferType<typeof transactionValidator>;
export type WithdrawForm = yup.InferType<typeof withdrawValidator>;
