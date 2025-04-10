use aiken/crypto.{VerificationKeyHash}

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
