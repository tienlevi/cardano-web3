import * as yup from "yup";

export const transactionValidator = yup
  .object({
    address: yup.string().required(),
    quantity: yup.number().positive().integer().required(),
  })
  .required();

export type TransactionForm = yup.InferType<typeof transactionValidator>;
