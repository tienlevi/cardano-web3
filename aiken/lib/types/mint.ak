use aiken/crypto.{Blake2b_256, Hash, ScriptHash, VerificationKeyHash}
use cardano/assets.{Value}
use cardano/transaction.{Datum, Transaction}

pub type MintAction {
  owner: ByteArray,
  token: Int,
  name: ByteArray,
  description: ByteArray,
  image: ByteArray,
}

pub type MintTransaction {
  extra_signatories: List<VerificationKeyHash>,
}

pub type Address {
  payment_credential: ByteArray,
  stake_credential: Option<ByteArray>,
}

pub type OutputReference {
  transaction_id: Hash<Blake2b_256, Transaction>,
  output_index: Int,
}

pub type Output {
  tokenName: ByteArray,
  image: ByteArray,
  description: ByteArray,
}

pub type TransactionContext {
  TransactionContext(ByteArray)
}

pub type Input {
  output_reference: OutputReference,
  output: Output,
}
