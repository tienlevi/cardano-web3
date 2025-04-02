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

validator markets {
  spend(
    _datum: Option<Datum>,
    redeemer: Market,
    _own_ref: OutputReference,
    tx: Transaction,
  ) {
    when redeemer is {
      Buy { amount, buyer, owner } -> {
        let signed = list.has(tx.extra_signatories, owner)
        let valid_amount = amount > 0
        let buy = buyer == "buy"
        signed && valid_amount && buy
      }
      Sell { amount, seller, owner } -> {
        let signed = list.has(tx.extra_signatories, owner)
        let valid_amount = amount > 0
        let sell = seller == "sell"
        signed && valid_amount && sell
      }
    }
  }

  mint(redeemer: MintAction, policy_id: PolicyId, tx: MintTransaction) {
    // Hardcoded public key hash (Blake2b-224 hash of a public key) 
    let authorized_key = crypto.blake2b_224(policy_id)
    let is_signed = list.has(tx.extra_signatories, authorized_key)
    let valid_redeemer = redeemer.msg == "Mint Now"
    is_signed && valid_redeemer
  }

  else(_) {
    fail
  }
}

test main() {
  let datum = Datum { owner: #"00000000000000000000000000000000" }
  let redeemer = Redeemer { msg: "Success" }
  let ref = OutputReference { transaction_id: "", output_index: 0 }
  let tx = Transaction { extra_signatories: [datum.owner] }
  smart_contract.spend(Some(datum), redeemer, ref, tx)
}

test market_action() {
  let datum = Datum { owner: #"00000000000000000000000000000000" }
  let ref = OutputReference { transaction_id: "", output_index: 0 }
  let tx = Transaction { extra_signatories: [datum.owner] }
  let transfer =
    Buy {
      amount: 3322,
      buyer: "buy",
      owner: #"00000000000000000000000000000000",
    }
  markets.spend(Some(datum), transfer, ref, tx)
}

test mint_action() {
  let redeemer =
    MintAction {
      owner: crypto.blake2b_224(
        #"6213d54eac79892450e0125a0ced7a86711f0522b8b44e62f9e2b3ea",
      ),
      msg: "Mint Now",
    }
  let policy_id: PolicyId =
    crypto.blake2b_224(
      #"6213d54eac79892450e0125a0ced7a86711f0522b8b44e62f9e2b3ea",
    )
  let tx = MintTransaction { extra_signatories: [redeemer.owner] }
  markets.mint(redeemer, policy_id, tx)
}
