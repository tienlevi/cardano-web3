use aiken/crypto.{VerificationKeyHash}

pub type MintAction {
  owner: ByteArray,
  msg: ByteArray,
}

pub type MintTransaction {
  extra_signatories: List<VerificationKeyHash>,
}
