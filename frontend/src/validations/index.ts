import * as yup from "yup";

export const transactionValidator = yup
  .object({
    address: yup.string().required(),
    quantity: yup.number().min(1000000).integer().required(),
  })
  .required();

export type TransactionForm = yup.InferType<typeof transactionValidator>;
