use aiken/collection/list
use cardano/transaction.{OutputReference}
use types/vesting.{Datum, Transaction}

validator vest {
  spend(
    datum: Option<Datum>,
    _redeemer: Int,
    _ref: OutputReference,
    tx: Transaction,
  ) {
    expect Some(Datum { lock_until, owner, benificiary }) = datum

    let deadline = tx.lower_bound <= lock_until && tx.upper_bound <= lock_until

    let is_signed_by_benificiary = list.has(tx.extra_signatories, benificiary)

    is_signed_by_benificiary && deadline
  }

  else(_) {
    fail
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
