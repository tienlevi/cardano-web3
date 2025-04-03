use aiken/crypto.{VerificationKeyHash}

pub type Datum {
  lock_until: Int,
  owner: VerificationKeyHash,
  benificiary: VerificationKeyHash,
}

pub type Transaction {
  lower_bound: Int,
  upper_bound: Int,
  extra_signatories: List<VerificationKeyHash>,
}
