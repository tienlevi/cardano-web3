use aiken/collection/list
use aiken/crypto
use cardano/assets.{PolicyId}
use cardano/transaction.{OutputReference}
use types/market.{Buy, Datum, Market, Redeemer, Sell, Transaction}
use types/mint.{MintAction, MintTransaction}

validator smart_contract {
  spend(
    datum: Option<Datum>,
    redeemer: Redeemer,
    _own_ref: OutputReference,
    self: Transaction,
  ) {
    expect Some(Datum { owner }) = datum
    let messsage = redeemer.msg == "Hello world"
    let signed = list.has(self.extra_signatories, owner)
    messsage && signed
  }

  else(_) {
    fail
  }
}
