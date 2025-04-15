use aiken/collection/list
use aiken/crypto.{Blake2b_256, Hash, VerificationKeyHash}
use cardano/transaction.{OutputReference, Spend, Transaction, ValidityRange}

pub type VestingDatum {
  /// POSIX time in milliseconds, e.g. 1672843961000
  lock_until: Int,
  /// Owner's credentials
  owner: VerificationKeyHash,
  /// Beneficiary's credentials
  beneficiary: VerificationKeyHash,
}

validator vest {
  spend(
    datum_opt: Option<VestingDatum>,
    _redeemer: Data,
    _input: OutputReference,
    tx: Transaction,
  ) {
    expect Some(datum) = datum_opt
    or {
      key_signed(crypto.blake2b_224(tx.extra_signatories), datum.owner),
      and {
        key_signed(tx.extra_signatories, datum.beneficiary),
        valid_after(tx.validity_range, datum.lock_until),
      },
    }
  }

  else(_) {
    fail
  }
}

fn key_signed(transaction: Transaction, vk: VerificationKeyHash) {
  list.has(transaction.extra_signatories, vk)
}

fn valid_after(range: ValidityRange, lock_expiration_time: Int) {
  when range.lower_bound.bound_type is {
    Finite(tx_earliest_time) -> lock_expiration_time <= tx_earliest_time
    _ -> False
  }
}

test main() {
  let datum =
    Datum {
      lock_until: 2000,
      owner: #"e09d36c79f0d6d6e9e5252e74fd9b9e1c4ea16b3e57bf71d33b4e723",
      benificiary: #"e09d36c79f0d6d6e9e5252e74fd9b9e1c4ea16b3e57bf71d33b4e723",
    }
  let redeemer = 2000
  let tx =
    Transaction {
      lower_bound: 1000,
      upper_bound: 1500,
      extra_signatories: [datum.owner],
    }
  let ref = OutputReference { transaction_id: datum.owner, output_index: 2 }
  vest.spend(Some(datum), redeemer, ref, tx)
}
