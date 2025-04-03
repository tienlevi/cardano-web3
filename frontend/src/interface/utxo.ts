// Transaction-related interfaces for Cardano blockchain

/**
 * Represents a token unit with its quantity
 */
interface TokenUnit {
  unit: string;
  quantity: string;
}

/**
 * Represents a transaction input
 */
interface TransactionInput {
  address: string;
  amount: TokenUnit[];
  tx_hash: string;
  output_index: number;
  data_hash: string | null;
  inline_datum: string | null;
  reference_script_hash: string | null;
  collateral: boolean;
  reference: boolean;
}

/**
 * Represents a transaction output
 */
interface TransactionOutput {
  address: string;
  amount: TokenUnit[];
  output_index: number;
  data_hash: string | null;
  inline_datum: string | null;
  collateral: boolean;
  reference_script_hash: string | null;
  consumed_by_tx: string | null;
}

/**
 * Represents a complete transaction
 */
export interface TransactionUTXO {
  hash: string;
  inputs: TransactionInput[];
  outputs: TransactionOutput[];
}
