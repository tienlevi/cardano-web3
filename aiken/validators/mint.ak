use aiken/collection/list
use aiken/crypto.{Blake2b_256, Hash}
use cardano/assets as value
use cardano/transaction.{NoDatum, Transaction}
use types/mint.{
  Address, Input, MintAction, MintRedeemer, MintTransaction, OutputReference,
  TransactionContext,
}

validator mint_token {
  mint(redeemer: MintAction, policy_id: PolicyId, tx: MintTransaction) {
    let is_signed = list.has(tx.extra_signatories, policy_id)
    let name_redeemer = redeemer.name == "USDT"
    let description = redeemer.description == "USDT NFT"
    let token = redeemer.token == 10000
    is_signed && name_redeemer && description && token
  }

  else(_) {
    fail
  }
}

validator usdt_token {
  mint(
    redeemer: MintRedeemer,
    _tx_id: Hash<Blake2b_256, Transaction>,
    tx: TransactionContext,
  ) {
    let utxo_ref =
      OutputReference {
        transaction_id: #"6213d54eac79892450e0125a0ced7a86711f0522b8b44e62f9e2b3ea",
        output_index: 0,
      }
    let input = Input(utxo_ref, redeemer)
    when tx is {
      TransactionContext(_) -> list.has(inputs(utxo_ref), input)
    }
  }

  else(_) {
    fail
  }
}

pub fn inputs(utxo_ref: OutputReference) -> List<Input> {
  [
    Input(
      utxo_ref,
      Output { tokenName: "USDT", image: "ipfs://QmZUE7mNxSsDXP6T3dRcsqwkC3TKBkjpsGUU2b8PKMCi8k",, description: "USDT token" },
    ),
  ]
}

test can_mint() {
  let utxo_ref =
    OutputReference {
      transaction_id: #"6213d54eac79892450e0125a0ced7a86711f0522b8b44e62f9e2b3ea",
      output_index: 0,
    }
  let redeemer =
    MintRedeemer {
      tokenName: "USDT",
      image: "ipfs://QmZUE7mNxSsDXP6T3dRcsqwkC3TKBkjpsGUU2b8PKMCi8k",
      description: "USDT token",
    }
  let tx = TransactionContext(utxo_ref.transaction_id)
  usdt_token.mint(redeemer, utxo_ref.transaction_id, tx)
}

test mint_action() {
  let redeemer =
    MintAction {
      owner: crypto.blake2b_224(
        #"6213d54eac79892450e0125a0ced7a86711f0522b8b44e62f9e2b3ea",
      ),
      token: 10000,
      name: "USDT",
      description: "USDT NFT",
      image: "123",
    }
  let policy_id: PolicyId =
    crypto.blake2b_224(
      #"6213d54eac79892450e0125a0ced7a86711f0522b8b44e62f9e2b3ea",
    )
  let tx = MintTransaction { extra_signatories: [policy_id] }
  mint_token.mint(redeemer, policy_id, tx)
}
