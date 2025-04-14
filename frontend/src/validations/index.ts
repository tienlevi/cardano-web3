import * as yup from "yup";

export const transactionValidator = yup
  .object({
    address: yup
      .string()
      .required("Address is required")
      .test(
        "valid-addresses",
        "Please enter valid address(es). Separate multiple addresses with commas.",
        (value) => {
          if (!value) return false;
          const addresses = value.split(",").map((addr) => addr.trim());
          // At least one address must be entered and all addresses must have a valid format
          return (
            addresses.length > 0 && addresses.every((addr) => addr.length > 0)
          );
        }
      ),
    quantity: yup
      .number()
      .typeError("Quantity must be a number")
      .min(1000000, "Minimum quantity is 1,000,000 lovelace (1 ADA)")
      .integer("Quantity must be a whole number")
      .required("Quantity is required"),
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
  quantity: yup.number().integer().required(),
  expire: yup
    .number()
    .min(1)
    .max(7, "Maximum expiry time is 7 days")
    .integer()
    .required(),
});

export type TransactionForm = yup.InferType<typeof transactionValidator>;
export type VestingForm = yup.InferType<typeof vestingValidator>;
export type MintForm = yup.InferType<typeof mintValidator>;
