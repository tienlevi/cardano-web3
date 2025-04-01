use aiken/crypto.{VerificationKeyHash}

pub type Datum {
  owner: VerificationKeyHash,
}

pub type Redeemer {
  msg: ByteArray,
}

pub type RedeemerMint {
  msg: ByteArray,
  utxo: Int,
}

pub type Transaction {
  extra_signatories: List<VerificationKeyHash>,
}

pub type Market {
  Buy { amount: Int, buyer: ByteArray, owner: VerificationKeyHash }
  Sell { amount: Int, seller: ByteArray, owner: VerificationKeyHash }
}
